# Unidade 26 — Legibilidade, coesão e funções pequenas

Fase 1, Unidade 26. Cobre: extração de função, nomes que comunicam
intenção, redução de aninhamento (guard clauses), coesão (uma função faz
uma coisa só), duplicação de código e separação entre lógica pura e
efeitos colaterais (I/O, mutação, `console.log`).

## Esta unidade é diferente das anteriores

Em vez de implementar funções do zero, você vai **refatorar código que já
funciona**. Todas as funções em `exercises.js` já passam nos testes de
`exercises.test.js` exatamente como estão (exceto as duas da seção de
debugging, que têm um bug real). Seu trabalho é melhorar a estrutura
interna — nomes, tamanho de função, aninhamento, duplicação, separação de
efeitos colaterais — **sem mudar o comportamento observável**. Os testes
são a rede de segurança: se alguma alteração sua fizer um teste falhar,
você mudou comportamento, não só estrutura, e precisa reconsiderar.

Adaptação da estrutura padrão da unidade (8 fundamentais / 4
intermediários / 2 debugging / 1 refatoração / 1 desafio integrador):
como esta unidade inteira é sobre refatoração, a distribuição foi
ajustada para **6 fundamentais / 4 intermediários / 2 debugging / 2
refatoração / 2 desafio integrador** (ainda 16 exercícios) — duas vagas
que normalmente seriam "fundamentais" viraram exercícios extras de
refatoração e desafio integrador, já que "implementar uma função pequena
do zero" não é o foco central desta unidade.

## Por que isso importa para backend

Código que funciona mas é difícil de ler custa caro: todo bug futuro
nesse trecho vai demorar mais para ser encontrado, toda mudança pequena
vira uma mudança arriscada, e revisão de código vira adivinhação. Nomes
ruins escondem intenção. Funções grandes escondem múltiplas
responsabilidades dentro de uma só (baixa coesão). Efeitos colaterais
espalhados pelo meio de lógica pura tornam o comportamento imprevisível
e difícil de testar isoladamente. Refatorar sem quebrar comportamento —
com testes como guarda-corpo — é uma habilidade diária em qualquer time
de backend.

## Antes de começar

Responda por escrito antes de abrir qualquer documentação:

1. O que significa dizer que uma função tem "baixa coesão"? Dê um
   exemplo hipotético de uma função que faz coisas demais.
2. Por que um bloco de código copiado e colado (em vez de extraído para
   uma função reutilizável) é um risco maior do que parece à primeira
   vista?
3. Qual a diferença entre uma função "pura" e uma função com "efeitos
   colaterais"? Por que misturar as duas no mesmo bloco de código
   dificulta testar e reutilizar a lógica?

Não pesquise ainda. Escreva sua hipótese antes de refatorar qualquer
função — você vai comparar com o que encontrar no código.

## Como trabalhar

1. Abra `exercises.js`. Cada função já está implementada e os testes já
   passam (exceto as duas de debugging).
2. Rode os testes primeiro, antes de mudar qualquer coisa, para confirmar
   o estado inicial:

   ```bash
   node --test exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js
   ```

3. Refatore uma função por vez. Depois de cada mudança, rode os testes de
   novo — eles devem continuar passando (exceto as duas de debugging, que
   você vai corrigir de verdade).
4. Não mude a assinatura (nome da função, parâmetros) de nenhuma função —
   os testes dependem dela.
5. Prefira fazer commits pequenos por função refatorada, se estiver
   versionando seu progresso — facilita reverter se algo quebrar.

## Exercícios fundamentais (6)

1. **`calcTotalPriceMessy(items)`** — nomes de variável de uma letra
   (`t`, `x`, `r`) escondem o que a função faz. Extraia nomes claros e,
   se fizer sentido, um passo nomeado para o cálculo do imposto.
2. **`formatUserNameMessy(u)`** — ternário aninhado (ternário dentro de
   ternário) é difícil de ler numa primeira passada. Reescreva com `if`
   e retornos antecipados, ou com uma estrutura mais linear.
3. **`logAndCheckPositiveMessy(n, log)`** — mistura a decisão pura
   ("`n` é positivo?") com o efeito colateral de registrar no `log`.
   Extraia a verificação para uma função pura interna (ex.:
   `isPositive(n)`) e use-a dentro da função exportada, que continua
   fazendo o registro.
4. **`sumArrayWeirdMessy(a)`** — `while` com duas variáveis de contador
   de uma letra. Reescreva com um laço `for...of` (ou `reduce`) e nomes
   que descrevam o que está sendo somado.
5. **`parseCsvLineMessy(line)`** — funções anônimas (`function(s){...}`)
   sem nome descritivo tornam a cadeia de `.map()`/`.filter()` difícil de
   escanear. Use arrow functions com nomes de parâmetro claros, ou
   extraia funções nomeadas (`trimField`, `isNotEmpty`).
6. **`getDiscountLabelMessy(amount)`** — três níveis de `if/else`
   aninhados para uma decisão simples de faixas. Refatore com guard
   clauses (retorno antecipado) ou uma estrutura de dados de faixas.

## Exercícios intermediários (4)

7. **`processOrderMessy(order)`** — mistura validação, cálculo de
   subtotal, desconto, imposto e formatação de string numa função só, e
   ainda calcula o imposto duas vezes (`taxCheck` e `tax`, com um `if`
   morto comparando os dois). Extraia funções coesas — uma calcula, outra
   formata — e remova a duplicação/código morto.
8. **`buildUserReportMessy(users)`** — implementa manualmente, com laços
   `for` aninhados, o que `.filter()`, `.sort()` e `.map()` fariam de
   forma mais legível (inclusive um bubble sort escrito à mão). Refatore
   usando os métodos de array apropriados, mantendo o mesmo resultado.
9. **`updateInventoryMessy(inventory, updates)`** — muta o `inventory`
   recebido diretamente, o que é uma armadilha (quem chamou a função pode
   não esperar que seu objeto original mude). Refatore para retornar um
   **novo** objeto de inventário, sem mutar o parâmetro recebido — conecta
   com o que você viu na Unidade 25.
10. **`computeStatsMessy(numbers)`** — percorre o array quatro vezes
    (soma, mínimo, máximo, de novo para calcular a média) quando um único
    laço bem estruturado resolveria a maior parte disso. Refatore para
    reduzir a repetição de laços, mantendo o retorno idêntico.

## Debugging (2)

11. **`fixShadowedVariableBug(records)`** — a variável `total` é
    declarada duas vezes (uma no escopo externo, outra dentro do laço),
    e a interna "esconde" a externa (shadowing). Diagnostique por que o
    retorno é sempre `0` e corrija sem introduzir uma variável global ou
    mudar a assinatura.
12. **`fixCopyPasteBug(cart)`** — o bloco que calcula o subtotal de
    `"clothing"` foi copiado do bloco de `"electronics"` e o
    desenvolvedor esqueceu de trocar a referência do array. Corrija o
    bug e, se quiser ir além, extraia uma função auxiliar para não ter
    dois blocos quase idênticos de novo.

## Refatoração (2)

13. **`refactorGodFunctionOrderPipeline(rawOrder)`** — uma "função deus":
    valida, calcula subtotal, aplica desconto, calcula imposto e monta o
    resultado, tudo aninhado em três níveis de `if/else`. Refatore
    extraindo guard clauses para a validação e funções nomeadas para cada
    etapa do cálculo (subtotal, desconto, imposto), mantendo o mesmo
    objeto de retorno.
14. **`refactorSideEffectHeavyLogger(events)`** — mistura `console.log`
    (efeito colateral) em pelo menos dois pontos no meio da lógica de
    contagem (que é pura). Refatore para isolar a agregação como lógica
    pura e mover (ou remover) os efeitos colaterais, mantendo o mesmo
    valor de retorno.

## Desafio integrador (2)

15. **`refactorAndExtendReportModuleMessy(transactions)`** — dois laços
    quase idênticos (um para `"credit"`, outro para `"debit"`) repetem a
    mesma lógica de validação (`typeof t.amount === "number" && t.amount > 0`).
    Refatore para eliminar a duplicação — por exemplo, uma função
    auxiliar de validação reutilizada nos dois casos, ou um único laço
    que classifica por tipo — mantendo o mesmo objeto de retorno.
16. **`refactorMessyValidationPipeline(input)`** — já é relativamente
    curta, mas as três checagens são independentes e poderiam ser
    expressas como uma lista de regras (nome da regra + condição +
    mensagem) percorrida uniformemente, em vez de três `if`s
    copiados/colados com a mesma forma. Refatore para essa forma
    (ou equivalente), mantendo a mesma lista de erros e a mesma ordem.

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-26-readability-cohesion/exercises.test.js`
  sem falhas ao final (as duas de debugging também precisam estar
  verdes).
- Nenhuma função tem mais de ~15-20 linhas de corpo depois da refatoração
  (um bom sinal de que ela faz uma coisa só).
- Nenhuma variável tem nome de uma letra, exceto contadores de laço muito
  curtos e óbvios (`i`, `j`) — e mesmo esses, prefira nomes descritivos
  quando o contexto ajudar.
- Você consegue explicar, sem consultar o código, por que os testes
  passarem antes e depois da refatoração é a prova de que você não mudou
  o comportamento observável — só a estrutura interna.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
