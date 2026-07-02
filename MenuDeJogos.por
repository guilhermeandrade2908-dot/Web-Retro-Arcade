programa {

  // ESCOPO GLOBAL DO JOGO DA COBRINHA:
  
  // MATRIZ GLOBAL DEFINIDA COMO 9 POR 9
  cadeia campo[9][9] 
  
  // ##############################################
  
  // ESCOPO GLOBAL DO JOGO DA VELHA:
 
  // MATRIZ GLOBAL DO TABULEIRO DO JOGO DA VELHA
  caracter tI[3][3] = {{'1', '2', '3'},{'4','5','6'},{'7','8','9'}}

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
        iniciarJogoDaCobrinha() // ABRE A SIMULAÇÃO DO JOGO DA COBRINHA
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
    escreva("=== JOGO DA COBRINHA ===\n")
	
	// LAÇO DE REPETIÇÃO QUE GERA O CAMPO
    para(inteiro i=0;i<9;i++) {
    	escreva("\n")
    	para(inteiro j=0; j<9;j++) {
    		campo[i][j] = "[ ]"
    		escreva(campo[i][j])
    	}
    }
    	escreva("\n")

    campo[0][0] = "[*]"
	  campo[0][1] = "[*]"
	  campo[0][2] = "[*]"

	  telaDeCampoAtualizada()

	  para(inteiro k=0;k<9;k+=3) {
    	campo[0][0] = "[ ]"
    	campo[0][k] = "[*]"

	
  }
    telaDeCampoAtualizada()
 }

	// FUNÇÃO QUE ATUALIZA A TELA
  funcao telaDeCampoAtualizada() {
	escreva("\n")
  para(inteiro i=0;i<9;i++) {
    	escreva("\n")
    	para(inteiro j=0; j<9;j++) {
    		escreva(campo[i][j])
  	}
   }
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
