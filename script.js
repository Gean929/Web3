// ===== Loader =====
const loader = document.getElementById('loader');
const content = document.getElementById('content');
const progressBar = document.getElementById('progress');
const progressText = document.querySelector('.progress-text');
let progress = 0;

const loading = setInterval(() => {
  progress += 5;
  if (progress > 100) progress = 100; // garante que não passe de 100
  progressBar.style.width = progress + '%';
  progressText.textContent = `Carregando ${progress}%`;
  
  if (progress >= 100) {
    clearInterval(loading); // para o intervalo
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      content.classList.remove('hidden');
    }, 500);
  }
}, 100);

// ===== Copiar chave =====
function copiarChave() {
  const chave = "0x0384f0c684a21b9a5b1acaf9f78e8d2fd8e1b3e3";
  navigator.clipboard.writeText(chave);
  alert("Chave copiada com sucesso!");
}

// ===== Canvas linhas avançado =====
const canvas = document.getElementById('linesCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const lines = [];
const numLines = 60; // pode aumentar, mas evite travar
const colors = ['rgba(106,0,255,0.3)','rgba(0,238,255,0.3)','rgba(0,255,200,0.3)'];

for (let i = 0; i < numLines; i++) {
  lines.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
    color: colors[Math.floor(Math.random()*colors.length)],
    radius: Math.random() * 2 + 1
  });
}

let mouse = {x: width/2, y: height/2};
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });

// Função principal do canvas
function drawLines() {
  ctx.fillStyle = 'rgba(0,0,0,0.1)'; // efeito cauda
  ctx.fillRect(0,0,width,height);

  for(let i=0;i<numLines;i++){
    const line = lines[i];
    line.x += line.vx;
    line.y += line.vy;

    const dx = mouse.x - line.x;
    const dy = mouse.y - line.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    let alpha = 0.3;

    if(dist < 200){
      line.vx += dx*0.002;
      line.vy += dy*0.002;
      alpha = 0.8 - dist/250;
    }

    if(line.x<0||line.x>width) line.vx*=-1;
    if(line.y<0||line.y>height) line.vy*=-1;

    ctx.beginPath();
    ctx.fillStyle = line.color.replace('0.3',alpha.toFixed(2));
    ctx.arc(line.x,line.y,line.radius,0,Math.PI*2);
    ctx.fill();

    for(let j=i+1;j<numLines;j++){
      const nextLine = lines[j];
      const dx2 = nextLine.x - line.x;
      const dy2 = nextLine.y - line.y;
      const distance = Math.sqrt(dx2*dx2 + dy2*dy2);
      if(distance<120){
        ctx.beginPath();
        ctx.strokeStyle = line.color.replace('0.3', (1-distance/150).toFixed(2));
        ctx.lineWidth = 1;
        ctx.moveTo(line.x,line.y);
        ctx.lineTo(nextLine.x,nextLine.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawLines);
}

// Inicia o canvas após 100ms para não travar o loader
setTimeout(drawLines,100);
