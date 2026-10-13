# Unidade 16 — Regular expressions

Fase 1, Unidade 16. Cobre: literais de regex (`/padrão/flags`),
`RegExp.prototype.test`, `String.prototype.match`/`matchAll`, `replace`
(com string e com função de callback), grupos de captura (numerados e
nomeados), classes de caracteres, quantificadores, âncoras (`^`, `$`),
fronteiras de palavra (`\b`) e as flags `g` (global) e `i`
(case-insensitive).

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Sem a flag `g`, `.match()` retorna o quê exatamente? E com `g`?
2. O que `^` e `$` fazem dentro de uma regex, e por que esquecê-los é uma
   fonte comum de bugs de validação "boa demais" (aceita coisa que não
   devia)?
3. Qual a diferença entre `\d+` e `\d*`? E entre `.` e `\.`  dentro de uma
   regex?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. O primeiro exercício (`isValidEmailSimple`) já
   vem resolvido como exemplo de estilo — leia com atenção antes de
   seguir.
2. Os demais exercícios têm `throw new Error("not implemented: <nome>")`.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-16-regex/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e o primeiro exercício, que já
   está implementado). Isso é esperado.
5. Não use bibliotecas externas. Regex nesta unidade deve ser escrita à
   mão — não use pacotes de validação prontos (`validator`, etc.).

## Exercícios fundamentais (8)

1. **`isValidEmailSimple(str)`** — valida um formato básico de e-mail
   (`algo@algo.algo`, sem espaços). Não precisa cobrir todos os casos
   exóticos do RFC de e-mail — só o suficiente para rejeitar strings
   claramente inválidas. **Já implementado como exemplo.**
2. **`extractNumbers(str)`** — extrai todas as sequências de dígitos de
   uma string e retorna um array de `number` (não de string).
3. **`maskCreditCard(str)`** — substitui todo dígito que tenha pelo
   menos 4 dígitos depois dele por `*`, preservando os últimos 4 dígitos
   visíveis. Deve funcionar mesmo com o número embutido em outro texto.
4. **`countWordOccurrences(text, word)`** — conta quantas vezes `word`
   aparece como **palavra inteira** (não como substring de outra
   palavra) em `text`, ignorando maiúsculas/minúsculas. Use `\b`.
5. **`slugify(str)`** — converte para minúsculas, troca qualquer
   sequência de caracteres que não seja letra/número por um único hífen,
   e remove hífens sobrando no início/fim.
6. **`extractHashtags(text)`** — retorna um array com todas as hashtags
   de `text` (sequências que começam com `#`), **sem** o símbolo `#`.
7. **`isStrongPassword(str)`** — retorna `true` se `str` tem pelo menos 8
   caracteres e contém ao menos uma letra maiúscula, uma minúscula, um
   dígito e um caractere especial (não alfanumérico).
8. **`normalizeWhitespace(str)`** — colapsa qualquer sequência de
   espaços, tabs ou quebras de linha em um único espaço, e remove
   espaços do início/fim.

## Exercícios intermediários (4)

9. **`parseQueryString(str)`** — recebe algo como `"a=1&b=2"` (sem o `?`
   inicial) e retorna `{ a: "1", b: "2" }`. String vazia retorna `{}`.
10. **`extractDateParts(str)`** — usa **grupos de captura nomeados**
    (`(?<year>...)`) para extrair `{ year, month, day }` (como `number`)
    de uma string no formato `"YYYY-MM-DD"`. Retorna `null` se não bater
    com o formato.
11. **`replaceTemplateVars(template, data)`** — substitui cada
    ocorrência de `{{chave}}` em `template` pelo valor correspondente em
    `data[chave]` (ou string vazia se a chave não existir), usando
    `.replace()` com uma função de callback.
12. **`splitOnMultipleDelimiters(str)`** — divide `str` em partes usando
    vírgula, ponto-e-vírgula **ou** pipe (`|`) como delimitador, e
    remove espaços em volta de cada parte resultante.

## Debugging (2)

13. **`isValidPhoneNumber(str)`** — a regex atual não tem âncoras
    (`^`/`$`), então strings com lixo antes/depois de um telefone válido
    (ex.: `"abc123-456-7890xyz"`) são aceitas incorretamente. Corrija.
14. **`extractAllPrices(text)`** — a regex atual não tem a flag `g`,
    então `.match()` só retorna o primeiro preço do texto, ignorando os
    demais. Corrija.

## Refatoração (1)

15. **`messyValidateUsername(str)`** — já funciona corretamente
    (comprimento entre 3-16, começa com letra, só contém
    letras/números/underscore, sem underscore duplo), mas testa várias
    regex separadas em sequência com vários `if`. Refatore para algo
    mais direto, mantendo exatamente as mesmas regras.

## Desafio integrador (1)

16. **`parseLogLine(line)`** — recebe uma linha como
    `"[2026-07-24 10:15:00] ERROR: Payment failed for order #4521"` e
    retorna
    `{ timestamp, level, message, orderId }` usando grupos de captura
    nomeados (`timestamp` é a string entre colchetes, `level` é a
    palavra antes de `:`, `message` é o texto restante sem o `#id` no
    final, `orderId` são só os dígitos depois de `#`). Retorna `null` se
    a linha não bater com o formato esperado. Combina regex com
    destructuring (unidade 11).

## Critérios de aceitação

- Os testes da unidade passam sem falhas.
- Você consegue explicar, sem consultar o código, por que uma regex sem
  `^`/`$` pode "vazar" e aceitar entradas inválidas.
- Você sabe quando usar `.test()` (validação booleana), `.match()`/`.matchAll()`
  (extração) e `.replace()` (substituição) — e por que `g` muda o
  comportamento de cada um.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
