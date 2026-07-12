// VARIÁVEIS PARA CAPTURA DOS ELEMENTOS
const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext('2d');
const btnBack = document.getElementById("btn-back-menu");

// CONFIGURAÇÃO DO BOTÃO DE VOLTAR PARA O MENU
btnBack.addEventListener('click', () => {
    window.location.href = "../hub/index.html";
});

// PROPRIEDADES DOS OBJETOS DO PONG:
const raqueteLargura = 12
const raqueteAltura = 80;

// PLAYER (ESQUERDA):
const player = {
    x: 20,
    y: canvas.height / 2 - raqueteAltura / 2,
    score: 0
};

// RASTREADOR DO MOUSE:
canvas.addEventListener('mousemove', (evento) => {
    const retanguloCanvas = canvas.getBoundingClientRect();

    let mouseY = evento.clientY - retanguloCanvas.top - (raqueteAltura / 2);

    if (mouseY < 0) {
        player.y = 0;
    } else if (mouseY > canvas.height - raqueteAltura) {
        player.y = canvas.height - raqueteAltura;
    } else {
        player.y = mouseY;
    }
});

// FUNÇÃO DE DESENHO DO JOGO:
function desenharJogo() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // DESENHA A REDE CENTRAL
    context.strokeStyle = "rgba(78, 84, 115, 0.4)";
    context.lineWidth = 4;
    context.setLineDash([15, 15]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    // DESENHA A RAQUETE DO PLAYER (NEON AZUL):
    context.fillStyle = "#00f0ff";
    // EFEITO DE BRILHO
    context.shadowBlur = 15;
    context.shadowColor = "#00f0ff";
    context.fillRect(player.x, player.y, raqueteLargura, raqueteAltura);
    // RESETA O EFEITO DE SOMBRA PARA NÃO BORRAR OS PRÓXIMOS DESENHOS
    context.shadowBlur = 0;
}

function gameLoop() {
    desenharJogo();
    requestAnimationFrame(gameLoop);
}

gameLoop();