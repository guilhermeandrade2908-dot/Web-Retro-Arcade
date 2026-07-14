// VARIÁVEIS PARA CAPTURA DOS ELEMENTOS
const canvas = document.getElementById("spaceCanvas");
const context = canvas.getContext('2d');
const btnBack = document.getElementById("btn-back-menu");
const htmlScore = document.getElementById("score-text");
const htmlLives = document.getElementById("lives-text");

// CONFIGURAÇÃO DO BOTÃO DE VOLTAR PARA O MENU
btnBack.addEventListener('click', () => {
    window.location.href = "../hub/index.html";
});

// CONFIGURAÇÕES DO ESTADO DE JOGO 
let score = 0;
let lives = 3;
let jogoFinalizado = false;

// PROPRIEDADES DA NAVE DO JOGADOR 
const naveWidth = 50;
const naveHeight = 20;

const player = {
    x: canvas.width / 2 - naveWidth / 2,
    y: canvas.height - 50,
    velocidade: 6,
    cor: "#00f0ff"
};

// RASTREADOR DE ENTRADAS DO TECLADO
const teclas = {
    arrowLeft: false,
    arrowRight: false,
    a: false,
    d: false
};

window.addEventListener("keydown", (evento) => { // ESCUTA QUANDO A TECLA É PRESSIONADA
    if (evento.key in teclas) {
        teclas[evento.key] = true;
    }
});

window.addEventListener("keyup", (evento) => { // ESCUTA QUANDO A TECLA É SOLTA
    if (evento.key in teclas) {
        teclas[evento.key] = false;
    }
});

// ATUALIZADORES E FÍSICA DO JOGO
function atualizarMovimento() {
    // SE A TECLA 'A' ESTIVER PRESSIONADA:
    if (teclas.arrowLeft || teclas.a) {
        player.x -= player.velocidade;
    }
    // SE A TECLA 'D' ESTIVER PRESSIONADA: 
    if (teclas.arrowRight || teclas.d) {
        player.x += player.velocidade;
    }

    // LIMITADORES DE BORDAS DO JOGO
    if (player.x < 10) {
        player.x = 10;
    }
    if (player.x > canvas.width - naveWidth - 10) {
        player.x = canvas.width - naveWidth - 10;
    }
};

// FUNÇÃO DE DESENHO DO JOGO:
function desenharJogo() {
    // LIMPA A TELA PARA O PRÓXIMO FRAME:
    context.clearRect(0, 0, canvas.width, canvas.height);

    // DESENHA A NAVE DO PLAYER 
    context.fillStyle = player.cor;
    context.shadowBlur = 15;
    context.shadowColor = player.cor;

    // BASE DA NAVE
    context.fillRect(player.x, player.y, naveWidth, naveHeight);

    // CANO DO CANHÃO CENTRALIZADOR
    context.fillRect(
        player.x + naveWidth / 2 - 4, // ALINHA NO MEIO DA BASE
        player.y - 8, // SOBE UM POUCO
        8, // LARGURA DO CANHÃO
        8 // ALTURA DO CANHÃO
    );

    // RESETA O EFEITO DE SOMBRA PARA NÃO IMPACTAR OUTRAS COISAS
    context.shadowBlur = 0;
}

// LOOP PRINCIPAL DO JOGO
function gameLoop() {
    if (!jogoFinalizado) {
        atualizarMovimento();
    }

    desenharJogo();
    requestAnimationFrame(gameLoop);
}

// INICIA O JOGO
gameLoop();