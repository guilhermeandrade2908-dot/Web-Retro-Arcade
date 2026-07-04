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
    
  // VARIÁVEIS DE CORPO DA COBRA 
  inteiro linhaRabo = 3
  inteiro linhaCorpo = 3
  inteiro linhaCabeca = 3
  inteiro colunaRabo = 2
  inteiro colunaCorpo = 3
  inteiro colunaCabeca = 4

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

    // POSICIONA OS PEDAÇOS DA COBRA NAS COORDENADAS ATUAIS
    campo[linhaRabo][colunaRabo] = "[*]"
	  campo[linhaCorpo][colunaCorpo] = "[*]"
	  campo[linhaCabeca][colunaCabeca] = "[o]"

    limpa() // LIMPA A TELA PARA GERAR O EFEITO DE ANIMAÇÃO

    escreva("=== JOGO DA COBRINHA ===\n")
    escreva("(Use W, A, S, D para mover | Digite 'sair' para parar) | Score: ", score)

    telaDeCampoAtualizada() // EXIBE O TABULEIRO RENDERIZADO

    escreva("\nDigite o comando: ")
    leia(comando)

    // MOVIMENTO PARA A DIREITA (TECLA D)
    se (comando == "d" ou comando == "D") {
        
        linhaRabo = linhaCorpo
        colunaRabo = colunaCorpo

        linhaCorpo = linhaCabeca
        colunaCorpo = colunaCabeca

        colunaCabeca += 1 // AVANÇA A CABEÇA PARA A DIREITA
      }

    // MOVIMENTO PARA A ESQUERDA (TECLA A)
    senao se (comando == "a" ou comando == "A") {
        
        linhaRabo = linhaCorpo
        colunaRabo = colunaCorpo

        linhaCorpo = linhaCabeca
        colunaCorpo = colunaCabeca
        
        colunaCabeca -= 1 // RECUA A CABEÇA PARA A ESQUERDA
    }

  // MOVIMENTO PARA BAIXO (TECLA S)
  senao se (comando == "s" ou comando == "S") {

      linhaRabo = linhaCorpo
      colunaRabo = colunaCorpo

      linhaCorpo = linhaCabeca
      colunaCorpo = colunaCabeca

      linhaCabeca += 1 // DESCE A CABEÇA UM DEGRAU 
     }

    // MOVIMENTO PARA CIMA (TECLA W)
    senao se (comando == "w" ou comando == "W") {
       
        linhaRabo = linhaCorpo
        colunaRabo = colunaCorpo
       
        linhaCorpo = linhaCabeca
        colunaCorpo = colunaCabeca

        linhaCabeca -= 1 // SOBE A CABEÇA UM DEGRAU
      }
    
    // SISTEMA DE COMER A MAÇÃ
    se(linhaCabeca == macaY e colunaCabeca == macaX) {

      macaX = u.sorteia(0,8)
      macaY = u.sorteia(0,8)

      score += 10

    }


    
    // SISTEMA DE GAME OVER: 
    se(linhaCabeca < 0 ou linhaCabeca > 8 ou colunaCabeca < 0 ou colunaCabeca > 8) {
      limpa()
      escreva("\n===    GAME OVER!     ===")
      escreva("\nVocê colidiu com a parede.")
      escreva("\n=========================")
      comando = "sair"
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
    escreva("=== JOGO DA NAVE ===\n")
  }

  // ###################################################
}
