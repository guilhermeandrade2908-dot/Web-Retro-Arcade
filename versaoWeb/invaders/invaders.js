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
    a: false,
    d: false,
    " ": false // BARRA DE ESPAÇO
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

window.addEventListener("keydown", (evento) => {
    if (evento.key in teclas) {
        teclas[evento.key] = true;

        if (evento.key === " ") {
            dispararLaser();
        }
    }
});

// CRIA UM NOVO LASER NO TOPO DA NAVE
function dispararLaser() {
    // SE JÁ TIVER 1 DISPARO NA TELA, NÃO É POSSÍVEL ATIRAR:
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

        // FAZ O LASER SUBIR NO EIXO Y
        laser.y -= laserVelocidade;

        // SE O LASER SAIR PELO TOPO, ELA É REMOVIDA DO ARRAY
        if (laser.y + laser.altura < 0) {
            lasers.splice(i, 1); // REMOVE O ELEMENTO DO ÍNDICE 'I'
            continue; // PULA PARA O PRÓXIMO LASER, JÁ QUE ESTE SUMIU
        }
    

    // COLISÃO DO LASER COM OS BUNKERS
    let colidiuBunker = false;
    for (let j = bunkers.length - 1; j >= 0; j--) {
        const bloco = bunkers[j];

        // CHECA A COLISÃO
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
    if (colidiuBunker) continue; // PULA A CHECAGEM DOS ALIENS SE O LASER JÁ QUEBROU NO BUNKER

    // COLISÃO COM OS ALIENS
    for (let a = aliens.length - 1; a >= 0; a--) {
        const alien = aliens[a];

        if (laser.x < alien.x +alien.largura &&
            laser.x + laser.largura > alien.x &&
            laser.y < alien.y + alien.altura &&
            laser.y + laser.altura > alien.y) {

                // SOMA OS PONTOS BASEADO NA FILEIRA DO ALIEN ATINGIDO
                score += alien.pontos;
                if (htmlScore) htmlScore.textContent = String(score).padStart(4, '0');

                // REMOVE O ALIEN E O LASER QUE COLIDIRAM
                aliens.splice(a, 1);
                lasers.splice(i, 1);

                // AUMENTA LIGEIRAMENTE A VELOCIDADE DOS SOBREVIVENTES
                aliensVelocidadeX += 0.08;

                break; // PARA O TESTE NO LASER EM ESPECÍFICO
        }
    }
}
}

// FUNÇÃO QUE MOVE OS ALIENS E CHECA AS BORDAS:
function atualizarAliens() {
    let descerBloco = false;

    // MOVE OS ALIENS HORIZONTALMENTE E VERFICIA SE ALGUM TOCOU A BORDA
    for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
        alien.x += aliensVelocidadeX * aliensDirecaoX;

        // SE ENCOSTAR NA BORDA DIREITA OU ESQUERDA DO CANVAS:
        if (alien.x + alien.largura >= canvas.width - 10 || alien.x <= 10) {
            descerBloco = true;
        }

        // SE ALGUM ALIEN ENCOSTAR NA LINHA DA NAVE, O JOGO ACABA:
        if (alien.y + alien.altura >= player.y) {
            jogoFinalizado = true;
        }
    }

    // SE ALGUM ALIEN TOCOU A BORDA, INVERTE A DIREÇÃO HORIZONTAL E DESDE TODOS ELES EM UMA LINHA
    if (descerBloco) {
        aliensDirecaoX *= -1; // INVERTE O LADO
        for (let i = 0; i < aliens.length; i++) {
            aliens[i].y += aliensVelocidadeY; // DESCE O Y
        }
    }
}

// FUNÇÃO QUE FAZ UM ALIEN ALEATÓRIO ATIRAR:
function atirarAlien() {
    if (aliens.length === 0) return;

        // SORTEIA SE ALGUM ALIEN VAI ATIRAR NO FRAME
        if (Math.random() < taxaDisparoAlien) {
            // ESSCOLHE UM ALIEN ALEATÓRIO DA HORDA PARA DISPARAR:
            const alienSorteado = aliens[Math.floor(Math.random() * aliens.length)];

            // CRIA O TIRO SAINDO DA BASE DO ALIEN
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

        // FAZ O RAIO DESCER NA TELA
        tiro.y += laserAlienVelocidade;

        // SE SAIR PELA PARTE INFERIOR, REMOVE DO ARRAY:
        if (tiro.y > canvas.height) {
            laserAliens.splice(i, 1);
            continue;
        }

        // COLISÃO DOS TIROS DOS ALIENS COM OS BUNKERS:
        let colidiuBunker = false;
        for (let j = bunkers.length - 1; j >= 0; j--) {
            const bloco = bunkers[j];

            if (tiro.x < bloco.x + bloco.largura &&
                tiro.x + tiro.largura > bloco.x &&
                tiro.y < bloco.y + bloco.altura &&
                tiro.y + tiro.altura > bloco.y) {

                    bunkers.splice(j, 1); // REMOVE O TIJOLO DO BUNKER
                    laserAliens.splice(i, 1); // REMOVE O TIRO DO ALIEN
                    colidiuBunker = true;
                    break;
                }
        }

        if (colidiuBunker) continue; // PULA PARA O PRÓXIMO TIRO SE ESTE COLIDIU NO BUNKER

        // COLISÃO DOS TIROS DOS ALIENS COM O PLAYER
        if (tiro.x < player.x + naveWidth &&
            tiro.x + tiro.largura > player.x &&
            tiro.y < player.y + naveHeight &&
            tiro.y + tiro.altura > player.y) {

                // REMOVE O TIRO QUE ATINGIU A NAVE:
                laserAliens.splice(i, 1);

                // REDUZ UMA VIDA:
                lives--;
                if (htmlLives) htmlLives.textContent = "♥".repeat(Math.max(0, lives)) || "---";

                // SE AINDA HOUVER VIDAS, RESETA A POSIÇÃO DO PLAYER NO CENTRO
                if (lives > 0) {
                    player.x = canvas.width / 2 - naveWidth / 2;
                }
        }
    }
}

function atualizarUfo() {
    // CASO NÃO EXISTA UMA NAVE MÃE NA TELA, TENTA SPAWNAR:
    if (ufo === null) {
        if (Math.random() < ufoChanceAparecer && aliens.length > 0) {
            // SORTEIA SE ELA VEM DA ESUQERDA (DIREÇÃO 1) OU DIREITA (DIREÇÃO -1)
            const direcaoEsquerda = Math.random() < 0.5;
            ufo = {
                x: direcaoEsquerda ? -ufoLargura : canvas.width,
                y: 15, // FICA POSICIONADO BEM NO TOPO DA TELA, ACIMA DOS ALIENS NORMAIS
                largura: ufoLargura,
                altura: ufoAltura,
                direcao: direcaoEsquerda ? 1 : -1,
                pontos: [100, 150, 200, 300][Math.floor(Math.random() * 4)] // PONTOS BONUS ALEATÓRIOS
            };
        }
    } else {
        // MOVE A NAVE MÃE HORIZONTALMENTE
        // SE SAIR COMPLETAMENTE DA TELA, SOME COM ELA:
        if (ufo.direcao === 1 && ufo.x > canvas.width) {
            ufo = null;
        } else if (ufo.direcao === -1 && ufo.x + ufo.largura < 0) {
            ufo = null;
        }
    }

    // DETECTA A COLISÃO DO LASER COM A NAVE MÃE:
    if (ufo !== null) {
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];

            if (laser.x < ufo.x + ufo.largura &&
                laser.x + laser.largura > ufo.x &&
                laser.y < ufo.y + ufo.altura &&
                laser.y + laser.altura > ufo.y) {

                    // ACERTOU, LOGO, SOMA NA PONTUAÇÃO
                    score += ufo.pontos;
                    if (htmlScore) htmlScore.textContent = String(score).padStart(4, '0');

                    ufo = null; // DESTRÓI A NAVE MÃE
                    lasers.splice(i, 1); // REMOVE O LASER DO PLAYER
                    break;
                }
        }
    }
}

// ATUALIZADORES E FÍSICA DO JOGO
function atualizarMovimento() {
    // SE A TECLA 'A' ESTIVER PRESSIONADA:
    if (teclas.a) {
        player.x -= player.velocidade;
    }
    // SE A TECLA 'D' ESTIVER PRESSIONADA: 
    if (teclas.d) {
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

    // DESENHO DOS LASERS DO JOGADOR
    lasers.forEach(laser => {
        context.fillStyle = laser.cor;
        context.shadowBlur = 10;
        context.shadowColor = laser.cor;
        context.fillRect(laser.x, laser.y, laser.largura, laser.altura);
    });

    // DESENHO OS BUNKERS
    bunkers.forEach(bloco => {
        context.fillStyle = bunkerCor;
        context.shadowBlur = 8;
        context.shadowColor = bunkerCor;
        context.fillRect(bloco.x, bloco.y, bloco.largura, bloco.altura);
    });

    // DESENHO DOS ALIENS
    aliens.forEach(alien => {
        context.fillStyle = "#ff007f";
        context.shadowBlur = 10;
        context.shadowColor = "#ff007f";


        // 1 = PIXEL PINTADO
        // 0 = PIXEL VAZIO
        // 2 = OLHO DO ALIEN
        const spriteAlien = [
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0], // Chifres / Antenas
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0], // Cabeça
            [0, 1, 1, 2, 1, 1, 2, 1, 1, 0], // Olhos (representados pelo número 2)
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Corpo / Braços
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1], // Perninhas laterais
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]  // Base do meio
        ];

        // CALCULA O TAMAMNHO DE CADA PIXEL INTERNO DO SPRITE BASEADO NO TAMANHO TOTAL DO ALIEN
        const pixelTamanhoX = alien.largura / spriteAlien[0].length;
        const pixelTamanhoY = alien.altura / spriteAlien.length;

        // VARRE A MATRIZ DESENHANDO BLOCO POR BLOCO
        for (let l = 0; l < spriteAlien.length; l++) {
            for (let c = 0; c < spriteAlien[l].length; c++) {
                const tipoPixel = spriteAlien[l][c];

                if (tipoPixel === 1){
                    // DESENHA A PARTE COLORIDA DO CORPO DO ALIEN
                    context.fillStyle = "#ff007f";
                    context.shadowBlur = 10;
                    context.fillRect(
                        alien.x + (c * pixelTamanhoX),
                        alien.y + (l * pixelTamanhoY),
                        pixelTamanhoX + 0.5,
                        pixelTamanhoY + 0.5
                    );
                } else if (tipoPixel === 2) {
                    // DESENHA OS OLHOS 
                    context.fillStyle = "#08090f";
                    context.shadowBlur = 0;
                    context.fillRect(
                        alien.x + (c * pixelTamanhoX),
                        alien.y + (l * pixelTamanhoY),
                        pixelTamanhoX + 0.5,
                        pixelTamanhoY + 0.5
                    );
                }
            }
        };
    });

    // DESENHO DOS TIROS DOS ALIENS
    laserAliens.forEach(tiro => {
        context.strokeStyle = "#ff0000";
        context.lineWidth = 2.5;
        context.shadowBlur = 10;
        context.shadowColor = "#ff0000";

        context.beginPath();
        // COMEÇA NO TOPO DO LASER
        context.moveTo(tiro.x + (tiro.largura / 2), tiro.y);

        // DESENHA O ZIGUE-ZAGUE DO RAIO ATÉ O FINAL DA ALTURA DELE
        context.lineTo(tiro.x, tiro.y + (tiro.altura * 0.3));
        context.lineTo(tiro.x + tiro.largura, tiro.y + (tiro.altura * 0.6));
        context.lineTo(tiro.x + (tiro.largura / 2), tiro.y + tiro.altura);

        context.stroke()
    });

    // RESETA O EFEITO DE SOMBRA PARA NÃO IMPACTAR OUTRAS COISAS
    context.shadowBlur = 0;
}

// FUNÇÃO QUE INICIA OS BUNKERS DO JOGO:
function inicializarBunkers() {
    bunkers.length = 0; 

    // CALCULA O ESPAÇAMENTO HORIZONTAL ENTRE OS 4 BUNKERS
    const espacoTotal = canvas.width;
    const larguraBunker = bunkerColunas * blocoTamanho;
    const espacoDisponivel = espacoTotal - (larguraBunker * bunkerLinhas);
    const intervaloX = espacoDisponivel / (bunkerQuantidade + 1); // DISTRIBUIÇÃO UNIFORME

    for (let b = 0; b < bunkerQuantidade; b++) {
        // CALCULA A COORDENADA X INICIAL DO BUNKER ESPECÍFICO
        const inicioX = intervaloX + b * (larguraBunker + intervaloX);
        const inicioY = canvas.height - 150; // POSICIONA UM POUCO ACIMA DA NAVE

        // CRIA A GRADE DE TIJOLOS DO BUNKER:
        for (let l = 0; l < bunkerLinhas; l++) {
            for (let c = 0; c < bunkerColunas; c++) {

                // PULA OS CANTOS SUPERIORES DO BUNKER PARA ELE FICAR COM A FORMA CLÁSSICA DE "U" INVERTIDO
                if (l === 0 && (c === 0 || c === bunkerColunas - 1)) continue; // CORTA CANTOS DE CIMA
                if (l === bunkerLinhas - 1 && (c > 1 && c < bunkerColunas - 2)) continue; // ABRE O VÃO DE BAIXO

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

// FUNÇÃO QUE CRIA A HORDA DE ALIENS NO TOPO DA TELA:
function inicializarAliens() {
    aliens.length = 0; // LIMPA O ARRAY ANTERIOR

    // PONTO DE PARTIDA NO TOPO ESQUERDO DO CANVAS
    const margemEsquerda = 35;
    const margemTopo = 50;

    for (let l = 0; l < aliensLinhas; l++) {
        for (let c = 0; c < aliensColunas; c++) {
            aliens.push({
                x: margemEsquerda + c * (aliensWidth + aliensRecuoX),
                y: margemTopo + l * (aliensHeight + aliensRecuoY),
                largura: aliensWidth,
                altura: aliensHeight,
                pontos: (aliensLinhas - l) * 10, // AS FILEIRAS MAIS ALTAS DÃO MAIS PONTOS
                vivo: true
            });
        }
    }
}

// LOOP PRINCIPAL DO JOGO
function gameLoop() {
    if (!jogoFinalizado) {
        atualizarMovimento();
        atualizarLasers();
        atualizarAliens();

        atirarAlien();
        atualizarLasersAliens();
    }

    desenharJogo();
    requestAnimationFrame(gameLoop);
}

// INICIA OS BUNKERS
inicializarBunkers();
// INICIA OS ALIENS
inicializarAliens();
// INICIA O JOGO
gameLoop();