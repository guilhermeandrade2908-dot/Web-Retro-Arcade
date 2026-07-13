// VARIÁVEIS PARA CAPTURA DOS ELEMENTOS
const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext('2d');
const btnBack = document.getElementById("btn-back-menu");

const htmlScorePlayer = document.getElementById("player-score");
const htmlScoreCpu = document.getElementById("cpu-score");

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

const cpu = {
    x: canvas.width - 20 - raqueteLargura, // ALINHADO NA DIREITA, RECUADO 20PX
    y: canvas.height / 2 - raqueteAltura / 2,
    score: 0,
    velocidade: 5.8 // VELOCIDADE MÁXIMA QUE A CPU CONSEGUE SE MOVER
}

const bola = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    raio: 7,
    velocidadeX: 5, // DIREÇÃO E VELOCIDADE HORIZONTAL (POSITIVO = DIREITO, NEGATIVO = ESQUERDA)
    velocidadeY: 5, // DIREÇÃO E VELOCIDADE VERTICAL (POSITIVO = BAIXO, NEGATIVO = CIMA)
    velocidadeInicial: 5
};

// RASTREADOR DO MOUSE:
window.addEventListener('mousemove', (evento) => {
    const retanguloCanvas = canvas.getBoundingClientRect();

    // CALCULA-SE ONDE O MOUSE ESTÁ PURAMENTE 
    let mouseY = evento.clientY - retanguloCanvas.top - (raqueteAltura / 2);

    //O VALOR É JOGADO DIRETO PARA O PLAYER:
    player.y = mouseY;

    // BARREIRA INDEPENDENTE: TRAVA O PLAYER DIRETO NO LIMITE DO CANVAS
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y > canvas.height - raqueteAltura) {
        player.y = canvas.height - raqueteAltura;
    }   
});

// FUNÇÃO PARA RASTREAR A BOLA NO CENTRO APÓS UM PONTO:
function resetarBola(quemPontuou) {
    bola.x = canvas.width / 2;
    bola.y = canvas.height / 2;

    if (quemPontuou === "player") {
        bola.velocidadeX = -bola.velocidadeInicial;
    } else {
        bola.velocidadeX = bola.velocidadeInicial;
    }

    bola.velocidadeY = (Math.random() > 0.5 ? 1 : -1) * bola.velocidadeInicial;
}

// INTELIGÊNCIA ARTIFICIAL DA CPU
function atualizarCPU() {
    // A CPU OLHA ONDE O CENTRO DA BOLA ESTÁ NO EIXO Y:
    const centroCpu = cpu.y + raqueteAltura / 2;

    // SE A BOLA ESTIVER ABAIXO DO CENTRO DA RAQUETE DA CPU, ELA SOBE
    if (bola.y > centroCpu + 10) {
        cpu.y += cpu.velocidade;
    }
    else if (bola.y < centroCpu - 10) {
        cpu.y -= cpu.velocidade;
    }

    // BARREIRA DE SEGURANÇA PARA A CPU NÃO SAIR DA TELA:
    if (cpu.y < 0) cpu.y = 0;
    if (cpu.y > canvas.height - raqueteAltura) cpu.y = canvas.height - raqueteAltura;
}

// MOTORES DE FÍSICA E COLISÃO:
function aplicarFisica() {
    // MOVIMENTA A BOLA SOMANDO A VELOCIDADE A CADA FRAME
    bola.x += bola.velocidadeX;
    bola.y += bola.velocidadeY;

    // COLISÃO COM O TETO E O CHÃO (INVERTE O Y)
    if (bola.y - bola.raio <= 0) {
        bola.y = bola.raio;
        bola.velocidadeY = -bola.velocidadeY;
    } else if (bola.y + bola.raio >= canvas.height) {
        bola.y = canvas.height - bola.raio;
        bola.velocidadeY = -bola.velocidadeY;
    }

    // COLISÃO COM AS RAQUETES:
    // COLISÃO COM A RAQUETE DO PLAYER (ESQUERDA):
    if (bola.velocidadeX < 0) {
        if (bola.x - bola.raio <= player.x + raqueteLargura &&
            bola.x + bola.raio >= player.x &&
            bola.y + bola.raio >= player.y &&
            bola.y - bola.raio <= player.y + raqueteAltura) {

                bola.velocidadeX = -bola.velocidadeX; 
                bola.x = player.x + raqueteLargura + bola.raio;

                bola.velocidadeX *= 1.05;
                bola.velocidadeY *= 1.05;
            }
    }
    else {
        if (bola.x + bola.raio >= cpu.x &&
            bola.x - bola.raio <= cpu.x + raqueteLargura &&
            bola.y + bola.raio >= cpu.y &&
            bola.y - bola.raio <= cpu.y + raqueteAltura) {
                
                bola.velocidadeX = -bola.velocidadeX;
                bola.x = cpu.x - bola.raio;

                bola.velocidadeX *= 1.05;
                bola.velocidadeY *= 1.05;
            }
    }

    // SISTEMA DE PONTUAÇÃO
    if (bola.x - bola.raio < 0) {
        // AUMENTA OS PONTOS DA CPU
        cpu.score++;

        if (htmlScoreCpu) {
            htmlScoreCpu.innerText = String(cpu.score).padStart(2, '0');
        }
        resetarBola("cpu");
    }
    else if (bola.x + bola.raio > canvas.width) {
        // AUMENTA OS PONTOS DO PLAYER
        player.score++;
        if(htmlScorePlayer) {
            htmlScorePlayer.innerText = String(player.score).padStart(2, '0');
        }
        resetarBola("player");
    }
    
}

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
    
    // DESENHA A RAQUETE DA CPU (NEON ROSA):
    context.fillStyle = "#ff007f";
    context.shadowColor = "#ff007f";
    context.fillRect(cpu.x, cpu.y, raqueteLargura, raqueteAltura);

    // DESENHA A BOLINHA (NEON BRANCO):
    context.fillStyle = "#fff";
    context.shadowColor = "#fff";
    context.beginPath();
    // UTILIZANDO A FUNÇÃO ARC, DESENHA O CIRCULO:
    context.arc(bola.x, bola.y, bola.raio, 0, Math.PI * 2);
    context.fill();
    
    // RESETA O EFEITO DE SOMBRA PARA NÃO BORRAR OS PRÓXIMOS DESENHOS
    context.shadowBlur = 0;
}

function gameLoop() {
    atualizarCPU();
    aplicarFisica();
    desenharJogo();
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
