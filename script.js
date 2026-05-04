document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  const oldCanvas = document.getElementById("waterWakeCanvas");

  if (oldCanvas) {
    oldCanvas.remove();
  }

  const canvas = document.createElement("canvas");
  canvas.id = "waterWakeCanvas";

  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "2";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let lastX = mouseX;
  let lastY = mouseY;

  let trail = [];
  let lastPointTime = 0;

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

    const now = performance.now();
    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    if (speed > 3 && now - lastPointTime > 28) {
      const angle = Math.atan2(dy, dx);
      const behindX = mouseX - Math.cos(angle) * 18;
      const behindY = mouseY - Math.sin(angle) * 18;

      trail.push({
        x: behindX,
        y: behindY,
        angle: angle,
        speed: Math.min(speed, 32),
        age: 0,
        life: 90
      });

      lastPointTime = now;
    }

    lastX = mouseX;
    lastY = mouseY;
  });

  function drawWakePoint(point) {
    const progress = point.age / point.life;
    const alpha = 0.18 * (1 - progress);
    const length = 18 + point.speed * 2.2 + progress * 34;
    const spread = 5 + point.speed * 0.28 + progress * 16;

    const backAngle = point.angle + Math.PI;
    const leftAngle = backAngle - 0.28;
    const rightAngle = backAngle + 0.28;

    const startX = point.x;
    const startY = point.y;

    const leftX = startX + Math.cos(leftAngle) * length;
    const leftY = startY + Math.sin(leftAngle) * length;
    const rightX = startX + Math.cos(rightAngle) * length;
    const rightY = startY + Math.sin(rightAngle) * length;

    const gradient = ctx.createRadialGradient(
      startX,
      startY,
      0,
      startX,
      startY,
      length
    );

    gradient.addColorStop(0, "rgba(59, 130, 246, " + alpha * 0.45 + ")");
    gradient.addColorStop(0.45, "rgba(45, 212, 191, " + alpha * 0.22 + ")");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(
      startX + Math.cos(backAngle - 0.16) * length * 0.45,
      startY + Math.sin(backAngle - 0.16) * length * 0.45 - spread,
      leftX,
      leftY
    );
    ctx.quadraticCurveTo(
      startX + Math.cos(backAngle) * length * 0.52,
      startY + Math.sin(backAngle) * length * 0.52,
      rightX,
      rightY
    );
    ctx.quadraticCurveTo(
      startX + Math.cos(backAngle + 0.16) * length * 0.45,
      startY + Math.sin(backAngle + 0.16) * length * 0.45 + spread,
      startX,
      startY
    );
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(37, 99, 235, " + alpha * 0.38 + ")";
    ctx.lineWidth = 0.7;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(
      startX + Math.cos(backAngle - 0.2) * length * 0.55,
      startY + Math.sin(backAngle - 0.2) * length * 0.55,
      leftX,
      leftY
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(
      startX + Math.cos(backAngle + 0.2) * length * 0.55,
      startY + Math.sin(backAngle + 0.2) * length * 0.55,
      rightX,
      rightY
    );
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    trail.forEach(function (point) {
      point.age += 1;
      drawWakePoint(point);
    });

    trail = trail.filter(function (point) {
      return point.age < point.life;
    });

    requestAnimationFrame(animate);
  }

  animate();
});
