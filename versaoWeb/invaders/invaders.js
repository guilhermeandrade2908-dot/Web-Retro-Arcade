// VARIÁVEIS PARA CAPTURA DOS ELEMENTOS
const canvas = document.getElementById("spaceCanvas");
const context = canvas.getContext('2d');
const btnBack = document.getElementById("btn-back-menu");
const htmlScore = document.getElementById("score-text");
const htmlLives = document.getElementById("lives-text");

// CONFIGURAÇÕES DOS TIROS
const lasers = []; // GUARDA TODOS OS TIROS ATIVOS NA TELA
const laserVelocidade = 12; // VELOCIDADE COM QUE O LASER SOBE (EIXO Y NEGATIVO)
const laserLargura = 4;
const laserAltura = 15;
const maxLasersNaTela = 1;

// CONFIGURAÇÕES DOS BUNKERS
const bunkers = []; 
const bunkerQuantidade = 4; // TOTAL DE ESCUDOS NA TELA
const bunkerLinhas = 4; // QUANTIDADE DE LINHAS DE BLOCOS POR BUNKERS
const bunkerColunas = 6; // QUANTIDADE DE COLUNAS DE BLOCOS POR BUNKERS
const blocoTamanho = 8; // TAMANHO DE CADA "TIJOLO" DO BUNKER EM PIXEL
const bunkerCor = "#00ff66";

// CONFIGURAÇÕES DOS ALIENS
const aliens = [];
const aliensLinhas = 4; // QUATRO FILEIRAS DE INIMIGOS
const aliensColunas = 8; // OITO ALIENS POR FILEIRA
const aliensWidth = 40;
const aliensHeight = 32;
const aliensRecuoX = 15; // ESPAÇO HORIZONTAL ENTRE ELES
const aliensRecuoY = 15; // ESPAÇO VERTICAL ENTRE AS FILEIRAS

// CONTROLE DE MOVIMENTO DO BLOCO
let aliensVelocidadeX = 1.5; // VELOCIDADE HORIZONTAL INICIAL (AUMENTA CONFORME MORREM)
let aliensVelocidadeY = 15; // O QUANTO ELES DESCEM AO BATER NA BORDA
let aliensDirecaoX = 1; // 1 = DIREITA, -1 = ESQUERDA

// CONFIGURAÇÕES DOS TIROS DOS ALIENS
const laserAliens = [];
const laserAlienVelocidade = 4.5; // UM POUCO MAIS LENTO PARA TEMPO DE REAÇÃO
const laserAlienLargura = 4;
const laserAlienAltura = 16;
let taxaDisparoAlien = 0.012; // PROBABILIDADE DE DISPARO POR FRAME DE APROXIMADAMENTE 1.2% DE CHANCE

// CONFIGURAÇÕES DA NAVE MÃE
let ufo = null; // COMEÇA NULL POR ESTAR FORA DA TELA
const ufoLargura = 50;
const ufoAltura = 24;
const ufoVelocidade = 3.5;
const ufoChanceAparecer = 0.002; 
const ufoCor = "#3b05a0";

// CONFIGURAÇÃO DO BOTÃO DE VOLTAR PARA O MENU
if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = "../index.html";
    });
}

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
    a: false,
    d: false,
    " ": false,
    "Enter": false
};

// TECLADO UNIFICADO (CORREÇÃO 1)
window.addEventListener("keydown", (evento) => {
    if (evento.key in teclas) {
        teclas[evento.key] = true;
    }

    if (evento.key === " " && !jogoFinalizado) {
        dispararLaser();
    }

    if (evento.key === "Enter" && jogoFinalizado) {
        reiniciarJogoCompleto();
    }
});

window.addEventListener("keyup", (evento) => {
    if (evento.key in teclas) {
        teclas[evento.key] = false;
    }
});

// CRIA UM NOVO LASER NO TOPO DA NAVE
function dispararLaser() {
    if (lasers.length >= maxLasersNaTela) return;

    const canhaoX = player.x + (naveWidth / 2) - (laserLargura / 2);
    const canhaoY = player.y - 10;

    lasers.push({
        x: canhaoX,
        y: canhaoY,
        largura: laserLargura,
        altura: laserAltura,
        cor: "#ffff00"
    });
}

// MOVE OS LASERS E REMOVE OS QUE SAÍRAM DA TELA
function atualizarLasers() {
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];

        laser.y -= laserVelocidade;

        if (laser.y + laser.altura < 0) {
            lasers.splice(i, 1);
            continue;
        }

        // COLISÃO DO LASER COM OS BUNKERS
        let colidiuBunker = false;
        for (let j = bunkers.length - 1; j >= 0; j--) {
            const bloco = bunkers[j];

            if (laser.x < bloco.x + bloco.largura &&
                laser.x + laser.largura > bloco.x &&
                laser.y < bloco.y + bloco.altura &&
                laser.y + laser.altura > bloco.y) {

                bunkers.splice(j, 1);
                lasers.splice(i, 1);
                colidiuBunker = true;
                break;
            }
        }
        if (colidiuBunker) continue;

        // COLISÃO COM OS ALIENS
        for (let a = aliens.length - 1; a >= 0; a--) {
            const alien = aliens[a];

            if (laser.x < alien.x + alien.largura &&
                laser.x + laser.largura > alien.x &&
                laser.y < alien.y + alien.altura &&
                laser.y + laser.altura > alien.y) {

                score += alien.pontos;
                if (htmlScore) htmlScore.textContent = String(score).padStart(4, '0');

                aliens.splice(a, 1);
                lasers.splice(i, 1);

                aliensVelocidadeX += 0.08;

                if (aliens.length === 0) {
                    inicializarAliens();
                    aliensVelocidadeX = 1.5 + (score / 1000);
                }

                break;
            }
        }
    }
}

// FUNÇÃO QUE MOVE OS ALIENS E CHECA AS BORDAS
function atualizarAliens() {
    let descerBloco = false;

    for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
        alien.x += aliensVelocidadeX * aliensDirecaoX;

        if (alien.x + alien.largura >= canvas.width - 10 || alien.x <= 10) {
            descerBloco = true;
        }

        for (let j = bunkers.length - 1; j >= 0; j--) {
            const bloco = bunkers[j];
    
            if (alien.x < bloco.x + bloco.largura &&
                alien.x + alien.largura > bloco.x &&
                alien.y < bloco.y + bloco.altura &&
                alien.y + alien.altura > bloco.y) {
    
                bunkers.splice(j, 1);
            }
        }
        
        if (alien.y + alien.altura >= player.y) {
            jogoFinalizado = true;
        }
    }

    if (descerBloco) {
        aliensDirecaoX *= -1;
        for (let i = 0; i < aliens.length; i++) {
            aliens[i].y += aliensVelocidadeY;
        }
    }
}

// FUNÇÃO QUE FAZ UM ALIEN ALEATÓRIO ATIRAR
function atirarAlien() {
    if (aliens.length === 0) return;

    if (Math.random() < taxaDisparoAlien) {
        const alienSorteado = aliens[Math.floor(Math.random() * aliens.length)];

        laserAliens.push({
            x: alienSorteado.x + (alienSorteado.largura / 2) - (laserAlienLargura / 2),
            y: alienSorteado.y + alienSorteado.altura,
            largura: laserAlienLargura,
            altura: laserAlienAltura,
            cor: "#ff0000"
        });
    }
}

// FUNÇÃO QUE ATUALIZA OS TIROS DOS ALIENS E DETECTA AS COLISÕES
function atualizarLasersAliens() {
    for (let i = laserAliens.length - 1; i >= 0; i--) {
        const tiro = laserAliens[i];

        tiro.y += laserAlienVelocidade;

        if (tiro.y > canvas.height) {
            laserAliens.splice(i, 1);
            continue;
        }

        let colidiuBunker = false;
        for (let j = bunkers.length - 1; j >= 0; j--) {
            const bloco = bunkers[j];

            if (tiro.x < bloco.x + bloco.largura &&
                tiro.x + tiro.largura > bloco.x &&
                tiro.y < bloco.y + bloco.altura &&
                tiro.y + tiro.altura > bloco.y) {

                bunkers.splice(j, 1);
                laserAliens.splice(i, 1);
                colidiuBunker = true;
                break;
            }
        }

        if (colidiuBunker) continue;

        if (tiro.x < player.x + naveWidth &&
            tiro.x + tiro.largura > player.x &&
            tiro.y < player.y + naveHeight &&
            tiro.y + tiro.altura > player.y) {

            laserAliens.splice(i, 1);
            lives--;
            if (htmlLives) htmlLives.textContent = "♥".repeat(Math.max(0, lives)) || "---";

            if (lives > 0) {
                player.x = canvas.width / 2 - naveWidth / 2;
            } else {
                jogoFinalizado = true;
            }
        }
    }
}

function atualizarUfo() {
    if (ufo === null) {
        if (Math.random() < ufoChanceAparecer && aliens.length > 0) {
            const direcaoEsquerda = Math.random() < 0.5;
            ufo = {
                x: direcaoEsquerda ? -ufoLargura : canvas.width,
                y: 15,
                largura: ufoLargura,
                altura: ufoAltura,
                direcao: direcaoEsquerda ? 1 : -1,
                pontos: [100, 150, 200, 300][Math.floor(Math.random() * 4)]
            };
        }
    } else {
        ufo.x += ufoVelocidade * ufo.direcao;

        if (ufo.direcao === 1 && ufo.x > canvas.width) {
            ufo = null;
        } else if (ufo.direcao === -1 && ufo.x + ufo.largura < 0) {
            ufo = null;
        }
    }

    if (ufo !== null) {
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];

            if (laser.x < ufo.x + ufo.largura &&
                laser.x + laser.largura > ufo.x &&
                laser.y < ufo.y + ufo.altura &&
                laser.y + laser.altura > ufo.y) {

                score += ufo.pontos;
                if (htmlScore) htmlScore.textContent = String(score).padStart(4, '0');

                ufo = null;
                lasers.splice(i, 1);
                break;
            }
        }
    }
}

// ATUALIZADORES E FÍSICA DO JOGO
function atualizarMovimento() {
    if (teclas.a) {
        player.x -= player.velocidade;
    }
    if (teclas.d) {
        player.x += player.velocidade;
    }

    if (player.x < 10) {
        player.x = 10;
    }
    if (player.x > canvas.width - naveWidth - 10) {
        player.x = canvas.width - naveWidth - 10;
    }
}

// FUNÇÃO DE DESENHO DO JOGO
function desenharJogo() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = player.cor;
    context.shadowBlur = 15;
    context.shadowColor = player.cor;

    context.fillRect(player.x, player.y, naveWidth, naveHeight);

    context.fillRect(
        player.x + naveWidth / 2 - 4,
        player.y - 8,
        8,
        8
    );

    lasers.forEach(laser => {
        context.fillStyle = laser.cor;
        context.shadowBlur = 10;
        context.shadowColor = laser.cor;
        context.fillRect(laser.x, laser.y, laser.largura, laser.altura);
    });

    bunkers.forEach(bloco => {
        context.fillStyle = bunkerCor;
        context.shadowBlur = 8;
        context.shadowColor = bunkerCor;
        context.fillRect(bloco.x, bloco.y, bloco.largura, bloco.altura);
    });

    context.shadowBlur = 10;
    context.shadowColor = "#ff007f";

    const spriteAlien = [
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 2, 1, 1, 2, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
    ];

    aliens.forEach(alien => {
        const pixelTamanhoX = alien.largura / spriteAlien[0].length;
        const pixelTamanhoY = alien.altura / spriteAlien.length;

        for (let l = 0; l < spriteAlien.length; l++) {
            for (let c = 0; c < spriteAlien[l].length; c++) {
                const tipoPixel = spriteAlien[l][c];

                if (tipoPixel === 1) {
                    context.fillStyle = "#ff007f";
                    context.fillRect(
                        alien.x + (c * pixelTamanhoX),
                        alien.y + (l * pixelTamanhoY),
                        pixelTamanhoX + 0.5,
                        pixelTamanhoY + 0.5
                    );
                } else if (tipoPixel === 2) {
                    context.shadowBlur = 0;
                    context.fillStyle = "#08090f";
                    context.fillRect(
                        alien.x + (c * pixelTamanhoX),
                        alien.y + (l * pixelTamanhoY),
                        pixelTamanhoX + 0.5,
                        pixelTamanhoY + 0.5
                    );
                    context.shadowBlur = 10;
                }
            }
        }
    });
    
    if (ufo !== null) {
        context.fillStyle = ufoCor;
        context.shadowBlur = 15;
        context.shadowColor = ufoCor;

        const spriteUfo = [
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
            [1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 0, 1, 1, 0, 1, 0, 0]
        ];

        const pixelTamanhoX = ufo.largura / spriteUfo[0].length;
        const pixelTamanhoY = ufo.altura / spriteUfo.length;

        for (let l = 0; l < spriteUfo.length; l++) {
            for (let c = 0; c < spriteUfo[l].length; c++) {
                if (spriteUfo[l][c] === 1) {
                    context.fillRect(
                        ufo.x + (c * pixelTamanhoX),
                        ufo.y + (l * pixelTamanhoY),
                        pixelTamanhoX + 0.5,
                        pixelTamanhoY + 0.5
                    );
                }
            }
        }
    }

    laserAliens.forEach(tiro => {
        context.strokeStyle = "#ff0000";
        context.lineWidth = 2.5;
        context.shadowBlur = 10;
        context.shadowColor = "#ff0000";

        context.beginPath();
        context.moveTo(tiro.x + (tiro.largura / 2), tiro.y);

        context.lineTo(tiro.x, tiro.y + (tiro.altura * 0.3));
        context.lineTo(tiro.x + tiro.largura, tiro.y + (tiro.altura * 0.6));
        context.lineTo(tiro.x + (tiro.largura / 2), tiro.y + tiro.altura);

        context.stroke();
    });

    context.shadowBlur = 0;
}

// FUNÇÃO QUE INICIA OS BUNKERS DO JOGO
function inicializarBunkers() {
    bunkers.length = 0; 

    const espacoTotal = canvas.width;
    const larguraBunker = bunkerColunas * blocoTamanho;
    const espacoDisponivel = espacoTotal - (larguraBunker * bunkerQuantidade);
    const intervaloX = espacoDisponivel / (bunkerQuantidade + 1);

    for (let b = 0; b < bunkerQuantidade; b++) {
        const inicioX = intervaloX + b * (larguraBunker + intervaloX);
        const inicioY = canvas.height - 150;

        for (let l = 0; l < bunkerLinhas; l++) {
            for (let c = 0; c < bunkerColunas; c++) {
                if (l === 0 && (c === 0 || c === bunkerColunas - 1)) continue;
                if (l === bunkerLinhas - 1 && (c > 1 && c < bunkerColunas - 2)) continue;

                bunkers.push({
                    x: inicioX + (c * blocoTamanho),
                    y: inicioY + (l * blocoTamanho),
                    largura: blocoTamanho,
                    altura: blocoTamanho
                });
            }
        }
    }
}

// FUNÇÃO QUE CRIA A HORDA DE ALIENS NO TOPO DA TELA
function inicializarAliens() {
    aliens.length = 0;

    const margemEsquerda = 35;
    const margemTopo = 50;

    for (let l = 0; l < aliensLinhas; l++) {
        for (let c = 0; c < aliensColunas; c++) {
            aliens.push({
                x: margemEsquerda + c * (aliensWidth + aliensRecuoX),
                y: margemTopo + l * (aliensHeight + aliensRecuoY),
                largura: aliensWidth,
                altura: aliensHeight,
                pontos: (aliensLinhas - l) * 10,
                vivo: true
            });
        }
    }
}

// FUNÇÃO QUE DESENHA TELA DE GAME OVER POR CIMA DO JOGO
function gameOver() {
    context.fillStyle = "rgba(8, 9, 15, 0.9)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "26px 'Press Start 2P', system-ui";
    context.fillStyle = "#ff0055";
    context.textAlign = "center";
    context.shadowBlur = 20;
    context.shadowColor = "#ff0055";
    
    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

    context.font = "14px 'Press Start 2P', system-ui";
    context.fillStyle = "#fff";
    context.shadowBlur = 8;
    context.shadowColor = "#fff";
    context.fillText(`PONTUAÇÃO FINAL: ${String(score).padStart(4, '0')}`, canvas.width / 2, canvas.height / 2 + 50);

    context.font = "12px 'Press Start 2P', system-ui";
    context.fillStyle = "#00f0ff";
    context.shadowBlur = 10;
    context.shadowColor = "#00f0ff";
    
    context.fillText("PRESSIONE [ENTER] PARA JOGAR NOVAMENTE", canvas.width / 2, canvas.height / 2 + 100);
    
    context.shadowBlur = 0;
}

// FUNÇÃO QUE REINICIA TUDO PARA RECOMEÇAR O JOGO
function reiniciarJogoCompleto() {
    score = 0;
    lives = 3;
    jogoFinalizado = false;
    aliensVelocidadeX = 1.5;
    aliensDirecaoX = 1;
    ufo = null;

    lasers.length = 0;
    laserAliens.length = 0;

    if (htmlScore) htmlScore.textContent = "0000";
    if (htmlLives) htmlLives.textContent = "♥".repeat(lives);

    player.x = canvas.width / 2 - naveWidth / 2;

    inicializarBunkers();
    inicializarAliens();
}

// LOOP PRINCIPAL DO JOGO
function gameLoop() {
    if (!jogoFinalizado) {
        atualizarMovimento();
        atualizarLasers();
        atualizarAliens();

        atirarAlien();
        atualizarLasersAliens();
        atualizarUfo();

        desenharJogo();
    } else {
        desenharJogo();
        gameOver();
    }

    requestAnimationFrame(gameLoop);
}

// INICIALIZAÇÃO DO JOGO
inicializarBunkers();
inicializarAliens();
gameLoop();
