const cursorGlow = document.createElement("div");
cursorGlow.className = "cursor-glow";
document.body.appendChild(cursorGlow);

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  cursorGlow.style.opacity = "1";
});

document.addEventListener("mouseleave", function () {
  cursorGlow.style.opacity = "0";
});

function animateCursorGlow() {
  currentX += (mouseX - currentX) * 0.08;
  currentY += (mouseY - currentY) * 0.08;

  cursorGlow.style.left = currentX + "px";
  cursorGlow.style.top = currentY + "px";

  requestAnimationFrame(animateCursorGlow);
}

animateCursorGlow();
