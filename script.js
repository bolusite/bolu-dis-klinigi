document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  const canvas = document.createElement("canvas");
  canvas.id = "waterWakeCanvas";

  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "20";
  canvas.style.opacity = "0.65";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let lastX = mouseX;
  let lastY = mouseY;

  let smoothX = mouseX;
  let smoothY = mouseY;

  let wakes = [];
  let lastCreateTime = 0;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function createWake(x, y, dx, dy) {
    const speed = Math.sqrt(dx * dx + dy * dy);

    if (speed < 1.5) return;

    const length = Math.min(130, Math.max(55, speed * 4.5));
    const spread = Math.min(42, Math.max(18, speed * 1.4));

    const angle = Math.atan2(dy, dx);

    const backAngle = angle + Math.PI;

    const leftAngle = backAngle - 0.42;
    const rightAngle = backAngle + 0.42;

    wakes.push({
      x: x,
      y: y,
      leftX: x + Math.cos(leftAngle) * length,
      leftY: y + Math.sin(leftAngle) * length + spread,
      rightX: x + Math.cos(rightAngle) * length,
      rightY: y + Math.sin(rightAngle) * length + spread,
      midX: x + Math.cos(backAngle) * length * 0.55,
      midY: y + Math.sin(backAngle) * length * 0.55 + spread * 0.5,
      age: 0,
      life: 95,
      alpha: 0.28,
      width: 1.1
    });
  }

  function drawWake(wake) {
    const progress = wake.age / wake.life;
    const alpha = wake.alpha * (1 - progress);
    const lift = progress * 22;

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "rgba(15, 118, 110, " + alpha + ")";
    ctx.lineWidth = wake.width + progress * 1.2;

    ctx.beginPath();
    ctx.moveTo(wake.x, wake.y);
    ctx.quadraticCurveTo(
      wake.midX - 14,
      wake.midY - lift,
      wake.leftX,
      wake.leftY - lift
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(wake.x, wake.y);
    ctx.quadraticCurveTo(
      wake.midX + 14,
      wake.midY - lift,
      wake.rightX,
      wake.rightY - lift
    );
    ctx.stroke();

    ctx.strokeStyle = "rgba(45, 212, 191, " + alpha * 0.55 + ")";
    ctx.lineWidth = 0.7;

    ctx.beginPath();
    ctx.moveTo(wake.x, wake.y + 4);
    ctx.quadraticCurveTo(
      wake.midX,
      wake.midY + 8 - lift,
      wake.x + (wake.midX - wake.x) * 1.15,
      wake.y + (wake.midY - wake.y) * 1.15 - lift
    );
    ctx.stroke();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    smoothX += (mouseX - smoothX) * 0.12;
    smoothY += (mouseY - smoothY) * 0.12;

    const dx = smoothX - lastX;
    const dy = smoothY - lastY;

    const now = performance.now();

    if (now - lastCreateTime > 70) {
      createWake(smoothX, smoothY, dx, dy);
      lastCreateTime = now;
    }

    lastX = smoothX;
    lastY = smoothY;

    wakes.forEach(function (wake) {
      wake.age += 1;
      drawWake(wake);
    });

    wakes = wakes.filter(function (wake) {
      return wake.age < wake.life;
    });

    requestAnimationFrame(animate);
  }

  animate();
});
