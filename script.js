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
  canvas.style.zIndex = "0";
  canvas.style.opacity = "0.55";

  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let smoothX = mouseX;
  let smoothY = mouseY;

  let time = 0;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function drawWaterSurface() {
    ctx.clearRect(0, 0, width, height);

    smoothX += (mouseX - smoothX) * 0.045;
    smoothY += (mouseY - smoothY) * 0.045;

    const gradient = ctx.createRadialGradient(
      smoothX,
      smoothY,
      20,
      smoothX,
      smoothY,
      420
    );

    gradient.addColorStop(0, "rgba(45, 212, 191, 0.18)");
    gradient.addColorStop(0.35, "rgba(15, 118, 110, 0.10)");
    gradient.addColorStop(1, "rgba(15, 118, 110, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const lineCount = Math.ceil(height / 28);

    for (let i = 0; i < lineCount; i++) {
      const baseY = i * 28;
      const distanceFromMouse = Math.abs(baseY - smoothY);
      const mouseInfluence = Math.max(0, 1 - distanceFromMouse / 260);

      ctx.beginPath();

      for (let x = -80; x <= width + 80; x += 18) {
        const distanceX = x - smoothX;
        const influence = Math.max(0, 1 - Math.abs(distanceX) / 360) * mouseInfluence;

        const naturalWave =
          Math.sin(x * 0.012 + time * 0.018 + i * 0.8) * 5 +
          Math.sin(x * 0.026 + time * 0.011 + i * 1.3) * 2.5;

        const mouseWave =
          Math.sin(distanceX * 0.045 - time * 0.055) * 14 * influence;

        const y = baseY + naturalWave + mouseWave;

        if (x === -80) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      const alpha = 0.045 + mouseInfluence * 0.08;
      ctx.strokeStyle = "rgba(15, 118, 110, " + alpha + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < 9; i++) {
      const radius = 45 + i * 34 + Math.sin(time * 0.018 + i) * 8;
      const alpha = Math.max(0, 0.09 - i * 0.008);

      ctx.beginPath();

      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.12) {
        const distortion =
          Math.sin(a * 5 + time * 0.025 + i) * 7 +
          Math.sin(a * 9 - time * 0.018) * 3;

        const x = smoothX + Math.cos(a) * (radius + distortion);
        const y = smoothY + Math.sin(a) * (radius * 0.55 + distortion * 0.45);

        if (a === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = "rgba(45, 212, 191, " + alpha + ")";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    time += 1;
    requestAnimationFrame(drawWaterSurface);
  }

  drawWaterSurface();
});
