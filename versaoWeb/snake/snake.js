// VARIÁVEIS PARA CAPTIURA DOS ELEMENTOS:
const canvas = document.getElementById("snakeCanvas");
const context = canvas.getContext('2d');
const btnBack = document.getElementById("btn-back-menu");
const htmlScore = document.getElementById("score-text");

// CONFIGURAÇÃO DO BOTÃO DE VOLTAR:
btnBack.addEventListener('click', () => {
    window.location.href = "../hub/index.html";
});

// CONFIGURAÇÕES DA GRID:
const tamanhoBloco = 20;
const linhas = canvas.height / tamanhoBloco; // 20 LINHAS
const colunas = canvas.width / tamanhoBloco; // 20 COLUNAS

// ESTADO INICIAL DO JOGO:
let score = 0;
let jogoFinalizado = false;

// ESTRUTURA DA COBRINHA VIA ARRAY DE COORDENADAS DA GRID:
let cobrinha = [
    {x: 10, y: 10,}, // CABEÇA (ÍNDICE ZERO)
    {x: 9, y: 10}, // CORPO
    {x: 8, y: 10} // CAUDA
];

// VETORES DE DIREÇÃO:
let direcaoX = 1;
let direcaoY = 0;

// TRAVA DE SEGURANÇA PARA IMPEDIR QUE O JOGADOR MUDE DE DIREÇÃO DUAS VEZES NO MESMO FRAME:
let direcaoMudouNesteFrame = false;

// CONTROLE DE VELOCIDADE:
let ultimoTempoExecucao = 0;
const velocidadeJogo = 100; // 100 MILISSEGUNDOS POR PASSO (100MS = 10 PASSOS POR SEGUNDO)

// CAPTURA DO TECLADO PARA MOVIMENTAÇÃO
window.addEventListener("keydown", (evento) => {
    if (direcaoMudouNesteFrame) return; // IGNORA SE JÁ MUDOU DE DIREÇÃO NESTE PASSO

    // CONVERTE PARA MINÚSCULO PARA IGNORAR O CAPSLOCK:
    const tecla = evento.key.toLocaleLowerCase();
    
    switch (evento.key) {
        case "w":
            if (direcaoY !== 1) {direcaoX = 0; direcaoY = -1; direcaoMudouNesteFrame = true;}
            break;
        case "s":
            if (direcaoY !== -1) {direcaoX = 0; direcaoY = 1; direcaoMudouNesteFrame = true;}
            break;
        case "a":
            if (direcaoX !== 1) {direcaoX = -1; direcaoY = 0; direcaoMudouNesteFrame = true;}
            break;
        case "d":
            if (direcaoX !== -1) {direcaoX = 1; direcaoY = 0; direcaoMudouNesteFrame = true;}
    }
});

// FUNÇÃO DE MOVIMENTAÇÃO
function moverCobrinha() {
    // CRIA UMA NOVA CABEÇA BASEADA NA POSIÇÃO ATUAL DA CABEÇA
    const novaCabeca = {
        x: cobrinha[0].x + direcaoX,
        y: cobrinha[0].y + direcaoY
    };

    // ADICIONA NOVA CABEÇA NO INÍCIO DO ARRAY:
    cobrinha.unshift(novaCabeca);

    // ENQUANTO NÃO HÁ COMIDA, ELA VAI MANTENDO O TAMANHO FIXO:
    cobrinha.pop();


    // RESETA A TRAVA DE DIREÇÃO PARA O PRÓXIMO PASSO
    direcaoMudouNesteFrame = false;
}

// FUNÇÃO QUE DESENHA O JOGO:
function desenharJogo() {
    // LIMPA O CAMPO DO CANVAS A CADA FRAME:
    context.clearRect(0, 0, canvas.width, canvas.height);

    // DESENHA CADA SEGMENTO DA COBRINHA:
    cobrinha.forEach((segmento, indice) => {
        // EFEITO DE DEGRADÊ NA CABEÇA E ESCURECIMENTO NO CORPO:
        const escurecimento = Math.min(indice * 8, 60); // LIMITA O ESCURECIMENTO
        context.fillStyle = `hsl(140, 100%, ${50 - escurecimento}%)`;

        // EFEITO DE BRILHO NEON APENAS NA CABEÇA DELA
        if (indice === 0) {
            context.shadowBlur = 15;
            context.shadowColor = "#00ff66";
        } else {
            context.shadowBlur = 0;
        }

        // DESENHA O BLOCO COM OS CANTOS LEVEMENTE ARREDONDADOS
        const raioDeCurvatura = 4;
        context.beginPath();
        context.roundRect(
            segmento.x * tamanhoBloco + 1,
            segmento.y * tamanhoBloco + 1,
            tamanhoBloco - 2,
            tamanhoBloco - 2,
            raioDeCurvatura
        );
        context.fill();
    });

    // RESETA O EFEITO DE SOMBRA PARA NÃO IMPACTAR OUTRAS COISAS
    context.shadowBlur = 0;
}

// FUNÇÃO QUE CARREGA O LOOP PRINCIPAL DO JOGO BASEADO EM TEMPO REAL:
function gameLoop(tempoAtual) {
    requestAnimationFrame(gameLoop);

    // CALCULA QUANTO TEMPO PASSOU DESDE O ÚLTTIMO PASSO
    const tempoDecorrido = tempoAtual - ultimoTempoExecucao;

    // SÓ ATUALIZA O MOVIMENTO SE TIVER PASSADO OS 100MS DA VELOCIDADE DO JOGO
    if (tempoDecorrido >= velocidadeJogo) {
        ultimoTempoExecucao = tempoAtual;

        if (!jogoFinalizado) {
            moverCobrinha();
            desenharJogo();
        }
    }
}

// INICIA O LOOP DO JOGO:
requestAnimationFrame(gameLoop);