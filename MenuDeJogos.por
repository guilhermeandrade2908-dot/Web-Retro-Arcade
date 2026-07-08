programa {

  inclua biblioteca Util --> u

  // ESCOPO GLOBAL DO JOGO DA COBRINHA:
  
  cadeia campo[9][9] // MATRIZ GLOBAL DEFINIDA COMO 9 POR 9


  // VARIÁVEIS DA MAÇÃ:
  inteiro macaX = 2
  inteiro macaY = 6

  // SISTEMA DE PONTUAÇÃO DO JOGO DA COBRINHA
  inteiro score = 0

  
  // ##############################################
  
  
  // ESCOPO GLOBAL DO JOGO DA VELHA:
 
  caracter tI[3][3] = {{'1', '2', '3'},{'4','5','6'},{'7','8','9'}} // MATRIZ GLOBAL DO TABULEIRO DO JOGO DA VELHA

  
  // ##############################################

  // ESCOPO GLOBAL DO JOGO DA NAVE:

  cadeia espaco[9][9] // MATRIZ QUE GERA O ESPAÇO/CAMPO ONDE SERÁ EXECUTADO O JOGO DA NAVE

  
  funcao inicio() {
    
    menuDeJogos() // ABRE O MENU DE JOGOS COM AS OPÇÕES DISPONÍVEIS PRIMEIRO

  }

  funcao menuDeJogos() {

    inteiro opcao = -1 // A VARIÁVEL OPÇÃO INICIA O PROGRAMA

    // SISTEMA DO MENU:  
    enquanto (opcao>5 ou opcao<1) {
    
    escreva("=== MENU DE JOGOS ===\n")
    escreva("1 - Jogo da Cobrinha\n")
    escreva("2 - Jogo da Velha\n")
    escreva("3 - Jogo da nave\n")
    escreva("4 - Reiniciar Menu\n")
    escreva("5 - Sair do Menu\n")
    
    escreva("\nDigite uma das opções válidas: ")
    leia(opcao)
    
    escolha(opcao) {

      caso 1: 
        iniciarJogoDaCobrinha() // ABRE O JOGO DA COBRINHA
        pare

      caso 2:
        jogarJogoDaVelha() // ABRE O JOGO DA VELHA
        pare

      caso 3:
         iniciarJogoDaNave() // ABRE A SIMULAÇÃO DO JOGO DA NAVE
        pare

        caso 4: 
          escreva("Menu Reiniciado!") // SIMULA O MENU REINICIADO
          pare

        caso 5:
          escreva("Saindo... Até logo!") // SIMULA A SAÍDA DO MENU
          pare
        
        // SE O USUÁRIO DIGITAR UMA OPÇÃO INVÁLIDA:
        caso contrario: 
        escreva("Opção inválida! Digite uma das opções válidas.\n")
        // VOLTAR PARA O MENU
        pare
    
      }
    }
  }

  // PROGRAMA DO JOGO DA COBRINHA
  funcao iniciarJogoDaCobrinha() {
    
  // VARIÁVEIS DE CORPO DA COBRA UTILIZANDO VETORES
  inteiro cobraX[81]
  inteiro cobraY[81]
  inteiro tamanhoCobra = 3 // TAMANHO INICIAL DA COBRA

  
  // DEFINE A POSIÇÃO INICIAL DA COBRA
  cobraY[0] = 3 cobraX[0] = 4 // CABEÇA
  cobraY[1] = 3 cobraX[1] = 3 // CORPO
  cobraY[2] = 3 cobraX[2] = 2 // RABO

  
  // VARIÁVEIS DE SORTEIO DA MAÇÃ
  macaX = u.sorteia(0,8)
  macaY = u.sorteia(0,8)
  
  
  cadeia comando = "" // VARIÁVEL QUE VAI RECEBER A ENTRADA DE MOVIMENTO OU SAIDA

	// LAÇO DE REPETIÇÃO PRINCIPAL DO JOGO

  enquanto (comando != "sair") {

    para(inteiro i=0;i<9;i++) { // LAÇO DE REPETIÇÃO QUE GERA O CAMPO LIMPO NA MEMÓRIA
    	para(inteiro j=0; j<9;j++) {
    		campo[i][j] = "[ ]"
    	}
    }

    // POSICIONA A MAÇÃ NO VISUAL DO CAMPO 
      campo[macaY][macaX] = "[X]"

    
    // POSICIONA OS PEDAÇOS DA COBRA (RABO ATÉ O CORPO)
    para(inteiro i = 1; i < tamanhoCobra; i++) {
      campo[cobraY[i]][cobraX[i]] = "[*]"
    }

    campo[cobraY[0]][cobraX[0]] = "[o]"
    

    limpa() // LIMPA A TELA PARA GERAR O EFEITO DE ANIMAÇÃO

    escreva("=== JOGO DA COBRINHA ===\n")
    escreva("(Use W, A, S, D para mover | Digite 'sair' para parar) | Score: ", score)

    telaDeCampoAtualizada() // EXIBE O TABULEIRO RENDERIZADO

    escreva("\nDigite o comando: ")
    leia(comando)

    // PASSA O COMANDO DE TRÁS PRA FRENTE, RESPECTIVAMENTE: O PEDAÇO [2] PEGA O DO [1], O [1] PEGA O DA CABEÇA [0]
    para(inteiro i = tamanhoCobra - 1; i > 0; i--) {
      cobraX[i] = cobraX[i - 1]
      cobraY[i] = cobraY[i - 1]
    }

    // MOVIMENTO PARA A DIREITA (TECLA D)
    se (comando == "d" ou comando == "D") {
        cobraX[0] += 1 // AVANÇA A CABEÇA PARA A DIREITA
      }

    // MOVIMENTO PARA A ESQUERDA (TECLA A)
    senao se (comando == "a" ou comando == "A") {
        cobraX[0] -= 1 // RECUA A CABEÇA PARA A ESQUERDA
    }

  // MOVIMENTO PARA BAIXO (TECLA S)
    senao se (comando == "s" ou comando == "S") {
        cobraY[0] += 1 // DESCE A CABEÇA UM DEGRAU 
     }

    // MOVIMENTO PARA CIMA (TECLA W)
    senao se (comando == "w" ou comando == "W") {
       cobraY[0] -= 1 // SOBE A CABEÇA UM DEGRAU
      }


    // SISTEMA DE GAME OVER: 
    se(cobraY[0] < 0 ou cobraY[0] > 8 ou cobraX[0] < 0 ou cobraX[0] > 8) {
      limpa()
      escreva("\n=========================")
      escreva("\n===    GAME OVER!     ===")
      escreva("\nVocê colidiu com a parede.")
      escreva("\n=========================")
      
      escreva("\nAperte ENTER para sair...")
      cadeia pausa
      leia(pausa)
      
      comando = "sair"
    }


    // SISTEMA DE COMER A MAÇÃ
    senao se(cobraY[0] == macaY e cobraX[0] == macaX) {
      macaX = u.sorteia(0,8)
      macaY = u.sorteia(0,8)
      
     
      cobraX[tamanhoCobra] = cobraX[tamanhoCobra - 1]
      cobraY[tamanhoCobra] = cobraY[tamanhoCobra - 1]

      
      tamanhoCobra += 1

      score += 10
    }
  }
}

  // FUNÇÃO QUE EXIBE A TELA ATUALIZADA
  funcao telaDeCampoAtualizada() {
    para(inteiro i=0; i<9; i++) {
      escreva("\n")
      para(inteiro j=0; j<9; j++) {
        escreva(campo[i][j])
      }
    }
    escreva("\n")
  }

  
  // ###################################################
 
  // PROGRAMA DO JOGO DA VELHA:
  funcao jogarJogoDaVelha() {
      caracter posicaoEscolhida
      caracter playerAtual = 'X'
      inteiro totalJogadas = 0
      logico algumVencedor = falso // VARIÁVEL DE CONTROLE DE FLUXO DO JOGO
    
    enquanto (totalJogadas < 9 e algumVencedor == falso) {
      iniciarJogoDaVelha()

      escreva("Jogador [", playerAtual, "], digite onde quer jogar: ")
      leia(posicaoEscolhida)
        
      jogadasJV(posicaoEscolhida, playerAtual)

      algumVencedor = verificarVencedor(playerAtual)
      se (algumVencedor == verdadeiro) {
        totalJogadas++
      } senao {
        // LÓGICA DE ALTERNÂNCIA DOS PLAYERS:
          se (playerAtual == 'X') {
            playerAtual = 'O'
        } senao {
              playerAtual = 'X'
            }
    totalJogadas++
    }
  }
    
  iniciarJogoDaVelha()
  se(algumVencedor == verdadeiro) {
    escreva("Fim de jogo! O jogador [", playerAtual, "] venceu!\n")
  } senao {
    escreva("Fim de jogo! Deu velha!\n")
  }
}

    funcao iniciarJogoDaVelha() {
      limpa()

      escreva("=== JOGO DA VELHA ===\n")
      escreva("  ",tI[0][0], "  |  ",tI[0][1], "  |  ",tI[0][2],"\n")
      escreva("----- ----- -----\n")
      escreva("  ",tI[1][0], "  |  ",tI[1][1], "  |  ",tI[1][2],"\n")
      escreva("----- ----- -----\n")
      escreva("  ",tI[2][0], "  |  ",tI[2][1], "  |  ",tI[2][2],"\n")
  
  }

  funcao jogadasJV (caracter posicao, caracter player) {
      escolha(posicao) {
        caso '1':
          tI[0][0] = player
          pare

        caso '2':
          tI[0][1] = player
          pare

        caso '3':
          tI[0][2] = player
          pare

        caso '4':
          tI[1][0] = player
          pare

        caso '5':
          tI[1][1] = player
          pare

        caso '6':
          tI[1][2] = player
          pare

        caso '7':
          tI[2][0] = player
          pare

        caso '8':
          tI[2][1] = player
          pare

        caso '9':
          tI[2][2] = player
          pare

        caso contrario:
          escreva("Opção inválida! Digite um valor disponível.")
          pare
      }
    }

    funcao logico verificarVencedor(caracter player) {
      // CHECAGEM DE LINHAS
      se(tI[0][0] == tI[0][1] e tI[0][1] == tI[0][2]) retorne verdadeiro
      se(tI[1][0] == tI[1][1] e tI[1][1] == tI[1][2]) retorne verdadeiro
      se(tI[2][0] == tI[2][1] e tI[2][1] == tI[2][2]) retorne verdadeiro

      // CHECAGEM DAS COLUNAS
      se(tI[0][0] == tI[1][0] e tI[1][0] == tI[2][0]) retorne verdadeiro
      se(tI[0][1] == tI[1][1] e tI[1][1] == tI[2][1]) retorne verdadeiro
      se(tI[0][2] == tI[1][2] e tI[1][2] == tI[2][2]) retorne verdadeiro

      // CHECAGEM DE DIAGONAIS
      se(tI[0][0] == tI[1][1] e tI[1][1] == tI[2][2]) retorne verdadeiro
      se(tI[0][2] == tI[1][1] e tI[1][1] == tI[2][0]) retorne verdadeiro

      retorne falso
    }

  // ###################################################
  
  // PROGRAMA DO JOGO DA NAVE
  funcao iniciarJogoDaNave() {
    inteiro naveX = 4

    // VARIÁVEIS DO SISTEMA DE DISPARO
    logico tiroAtivo = falso
    inteiro tiroX = 0
    inteiro tiroY = 0

    cadeia comando = ""

    // LAÇO DE REPETIÇÃO PRINCIPAL DO JOGO DA NAVE:
    enquanto(comando != "sair") {
      
      // LAÇO DE REPETIÇÃO QUE LIMPA O CAMPO NA MEMÓRIA
      para(inteiro i = 0; i < 9; i++) {
        para(inteiro j = 0; j < 9; j++) {
          espaco[i][j] = "[ ]"
        }
      }

      espaco[8][naveX] = "[▲]" // POSICIONA A NAVE NO MAPA

      se (tiroAtivo) {
        espaco[tiroY][tiroX] = "[|]"
      }

      limpa() // APAGA O CAMPO ANTERIOR PARA DAR IMPRESSÃO DE MOVIMENTO

    escreva("=== JOGO DA NAVE ===\n")
    escreva("( Use A e D para mover | Digite 'sair' para parar )\n")

    // RENDERIZA O MAPA NA TELA
    para(inteiro i = 0; i < 9; i++) {
      escreva("\n")
      para(inteiro j = 0; j < 9; j++) {
        escreva(espaco[i][j])
      }
    }
    escreva("\n")

    // SISTEMA DE MOVIMENTAÇÃO POR LEITURA DE ENTRADA E IF/ELSE IF
    escreva("\nComando: ")
    leia(comando)

    se(comando == "a" ou comando == "A") { // SÓ MOVE PARA A ESQUERDA SE NÃO ESTIVER NA DIREITA
      se(naveX > 0) {
        naveX -= 1
      }
    }
    senao se(comando == "d" ou comando == "D") { // SÓ MOVE PARA A DIREITA SE NÃO ESTIVER NA ESQUERDA
      se(naveX < 8) {
        naveX += 1
      }
    }
    senao se(comando == "w" ou comando == "W") {
      se(nao tiroAtivo) {
        tiroAtivo = verdadeiro
        tiroX = naveX
        tiroY = 7
      }
    }

    se(tiroAtivo) {
      tiroY -= 1
      
      se(tiroY < 0) {
        tiroAtivo = falso
      }
    }
  }
}

  // ###################################################
}
