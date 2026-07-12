// VARIÁVEIS QUE FARÃO O CONTROLE DAS INTERAÇÕES COM O MENU:
const insertCoinBtn = document.getElementById("insert-coin-btn");
const buttonPanel = document.querySelector(".button-panel");
const coinsDisplay = document.getElementById("footer-coins");

// VARIÁVEIS DE CONTROLE DOS BOTÕES DE JOGOS:
const btnPong = document.getElementById("play-pong");
const btnSpaceInvaders = document.getElementById("play-invaders");
const btnSnake = document.getElementById("play-snake");

let totalCreditos  = 0; // VARIÁVEL QUE ARMAZENA A QUANTIDADE DE FICHAS INSERIDAS

// EVENTO DE CLIQUE NO BOTÃO "INSERIR FICHA"
insertCoinBtn.addEventListener("click", () => {

    totalCreditos += 1; // AO CLICAR NO BOTÃO, AS FICHAS AUMENTAM +1
    
    let creditosFormatados = String(totalCreditos).padStart(2, '0'); // TRANSFORMA O NÚMERO EM TEXTO COM 2 DÍGITOS
    
    // ATUALIZA O DISPLAY DE CRÉDITOS NO FOOTER COM INCREMENTO DE FICHAS E ESTILIZAÇÃO DE TEXTO
    coinsDisplay.innerText = `CREDITOS: ${creditosFormatados}`;
    coinsDisplay.style.color = "#00f0ff";
    coinsDisplay.style.textShadow = "0 0 10px #00f0ff";
    
    // SE FOR A PRIMEIRA FICHA INSERIDA, LIGA OS BOTÕES 
    if (totalCreditos === 1) {
        
        buttonPanel.classList.add("arcade-on");
        btnPong.removeAttribute('disabled');
        btnSpaceInvaders.removeAttribute('disabled');
        btnSnake.removeAttribute('disabled');
    }

});

// EVENTOS DE REDIRECIONAMENTO PARA AS PÁGINAS DOS JOGOS
btnPong.addEventListener("click", () => {
    window.location.href = "../pong/index.html";
});

btnSpaceInvaders.addEventListener("click", () => {
    window.location.href = "../space-invaders/index.html";
});

btnSnake.addEventListener("click", () => {
    window.location.href = "../snake/index.html";
});
