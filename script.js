document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  const canvas = document.createElement("canvas");
  canvas.id = "waterRippleCanvas";

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "0";
  canvas.style.opacity = "0.9";

  document.body.prepend(canvas);

  const context = canvas.getContext("2d");

  let width;
  let height;
  let ripples = [];
  let lastRippleTime = 0;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function createRipple(x, y) {
    ripples.push({
      x: x,
      y: y,
      radius: 0,
      maxRadius: 90 + Math.random() * 40,
      opacity: 0.32,
      lineWidth: 1.3
    });
  }

  document.addEventListener("mousemove", function (event) {
    const now = Date.now();

    if (now - lastRippleTime > 45) {
      createRipple(event.clientX, event.clientY);
      lastRippleTime = now;
    }
  });

  function animateRipples() {
    context.clearRect(0, 0, width, height);

    ripples.forEach(function (ripple, index) {
      ripple.radius += 1.8;
      ripple.opacity -= 0.006;
      ripple.lineWidth += 0.01;

      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);

      context.strokeStyle = "rgba(15, 118, 110, " + ripple.opacity + ")";
      context.lineWidth = ripple.lineWidth;
      context.stroke();

      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius * 0.55, 0, Math.PI * 2);

      context.strokeStyle = "rgba(45, 212, 191, " + ripple.opacity * 0.55 + ")";
      context.lineWidth = 0.8;
      context.stroke();

      if (ripple.opacity <= 0 || ripple.radius > ripple.maxRadius) {
        ripples.splice(index, 1);
      }
    });

    requestAnimationFrame(animateRipples);
  }

  animateRipples();
});
