programa {
  
  caracter tI[3][3] = {{'1', '2', '3'},{'4','5','6'},{'7','8','9'}}
  
  funcao inicio() {
    
    caracter posicaoEscolhida
    caracter playerAtual = 'X'

    iniciarJogoDaVelha()

    escreva("Digite onde quer jogar: ")
    leia(posicaoEscolhida)
    jogadasJV(posicaoEscolhida, playerAtual)

    iniciarJogoDaVelha()

  }

  funcao iniciarJogoDaVelha() {
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
}
