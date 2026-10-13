# Unidade 24 — JSON

Fase 1, Unidade 24. Cobre: `JSON.stringify`, `JSON.parse`, os parâmetros
`replacer` e `reviver`, tratamento de JSON malformado, tamanho em bytes de
uma string serializada, e armadilhas comuns do round-trip
objeto → JSON → objeto.

## Por que isso importa para backend

JSON é o formato de troca de dados mais comum entre serviços de backend:
corpo de requisição HTTP, resposta de API, arquivos de configuração,
mensagens de fila, logs estruturados. Um `JSON.parse` sem tratamento de
erro em cima de dado que vem de fora do seu controle (requisição de um
cliente, arquivo em disco, resposta de outro serviço) é uma das causas
mais comuns de crash em produção. E vazar campos sensíveis (senha, token)
num `JSON.stringify` displicente é uma classe inteira de vulnerabilidade.

## Antes de começar

Responda por escrito antes de abrir qualquer documentação:

1. O que acontece quando você chama `JSON.parse` numa string que não é
   JSON válido? A exceção lançada é de que tipo?
2. `JSON.stringify({ a: undefined, b: function(){}, c: 1 })` — o que você
   espera que aconteça com os campos `a` e `b`?
3. `JSON.stringify` tem um segundo e um terceiro parâmetro além do valor.
   Para que servem?

## Como trabalhar

1. Abra `exercises.js`. Cada função tem `throw new Error("not implemented: <nome>")`.
2. Implemente uma função por vez.
3. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-24-json/exercises.test.js
   ```

4. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging). Isso é esperado.
5. Nunca deixe um `JSON.parse` de dado externo sem tratamento de erro nos
   exercícios que envolvem entrada não confiável — é exatamente esse
   hábito que esta unidade quer construir.

## Exercícios fundamentais (8)

1. **`toJsonString(value)`** — serializa `value` para uma string JSON
   compacta (sem espaçamento), usando `JSON.stringify`.
2. **`prettyJsonString(value)`** — serializa `value` para uma string JSON
   indentada com 2 espaços (terceiro parâmetro de `JSON.stringify`).
3. **`parseJsonOrDefault(text, defaultValue)`** — tenta fazer
   `JSON.parse(text)`; se `text` não for JSON válido, retorna
   `defaultValue` em vez de deixar a exceção propagar.
4. **`stripUndefinedFields(obj)`** — retorna um novo objeto sem as chaves
   cujo valor é `undefined` (dica: `JSON.stringify` já ignora chaves
   `undefined` por padrão — você pode aproveitar isso).
5. **`roundTripEquality(value)`** — retorna `true` se `value` continua
   estruturalmente igual depois de passar por
   `JSON.parse(JSON.stringify(value))`, e `false` caso contrário. Você vai
   precisar escrever sua própria comparação (não use `JSON.stringify` dos
   dois lados só para comparar strings — isso sempre dá "igual", mesmo
   quando não deveria).
6. **`deepCloneViaJson(value)`** — retorna uma cópia profunda de `value`
   usando o truque `JSON.parse(JSON.stringify(value))`. Modificar a cópia
   não pode afetar o original, nem em campos aninhados.
7. **`jsonStringByteSize(value)`** — retorna o tamanho em **bytes** (não
   em caracteres) da versão JSON compacta de `value`. Use
   `Buffer.byteLength(...)`. Isso importa porque caracteres acentuados e
   emojis ocupam mais de 1 byte em UTF-8, mas contam como 1 caractere em
   `.length`.
8. **`isValidJson(text)`** — retorna `true` se `text` é JSON válido,
   `false` caso contrário. Não deixe a exceção escapar.

## Exercícios intermediários (4)

9. **`maskSensitiveFields(obj, sensitiveKeys)`** — retorna uma cópia de
    `obj` (sem modificar o original) onde qualquer chave cujo nome esteja
    em `sensitiveKeys` — **em qualquer profundidade** — tem seu valor
    substituído pela string `"***"`. Use o segundo parâmetro
    (`replacer`) de `JSON.stringify`, que é chamado para cada par
    chave/valor do objeto inteiro, inclusive aninhado.
10. **`reviveDates(text)`** — faz `JSON.parse(text)`, mas usa o terceiro
    parâmetro (`reviver`) para converter automaticamente qualquer valor
    string que pareça uma data ISO 8601
    (formato `AAAA-MM-DDTHH:mm:ss.sssZ`) numa instância real de `Date`,
    em qualquer profundidade do objeto.
11. **`parseNdjson(text)`** — recebe texto no formato **NDJSON**
    (newline-delimited JSON: um valor JSON válido por linha, comum em
    streaming de logs e exportação de dados em lote). Retorna um array
    com os valores parseados, ignorando linhas vazias.
12. **`safeMerge(base, patchJsonText)`** — faz o parse de `patchJsonText`
    (texto JSON vindo de uma fonte não confiável, como o corpo de uma
    requisição `PATCH`) e retorna um **novo** objeto com os campos de
    `base` sobrescritos pelos campos do patch (merge raso). Se
    `patchJsonText` for JSON inválido, lança um `Error` com mensagem
    clara contendo a palavra `"Invalid"`. Por segurança, ignore
    silenciosamente uma chave `"__proto__"` no patch — aceitar essa chave
    de um JSON externo é uma vulnerabilidade real de **poluição de
    protótipo** (prototype pollution).

## Debugging (2)

13. **`serializeUserProfileBuggy(user)`** — deveria serializar o perfil
    do usuário para enviar ao front-end, mas está vazando o campo
    `passwordHash` no JSON gerado. Corrija sem mudar a assinatura, e sem
    remover outros campos do usuário.
14. **`parseConfigBuggy(configText)`** — deveria mesclar a configuração
    informada sobre os valores padrão, e cair de volta para os valores
    padrão quando `configText` vem corrompido. Hoje, um JSON malformado
    derruba o processo com uma exceção não tratada.

## Refatoração (1)

15. **`refactorNormalizeApiResponse(responseText)`** — já funciona: faz
    parse de `responseText` e retorna `{ ok, error, data }` de acordo com
    o formato da resposta. A implementação atual tem uma pirâmide de
    `if/else` aninhados. Refatore usando retornos antecipados (guard
    clauses), mantendo exatamente o mesmo comportamento observável.

## Desafio integrador (1)

16. **`buildOrderReport(ordersJsonText)`** — recebe uma string JSON com
    um array de pedidos (`{ id, status, amount }`). Se o texto não for
    JSON válido, lança um `Error` com mensagem contendo `"Invalid"`.
    Caso contrário, monta e retorna uma **string JSON formatada** (com
    indentação) representando:

    ```js
    {
      totalOrders: number,          // quantidade total de pedidos
      totalRevenue: number,          // soma de amount de pedidos "paid"
      byStatus: { [status]: number } // contagem de pedidos por status
    }
    ```

    Combina `JSON.parse`/`JSON.stringify` (desta unidade) com `reduce` ou
    `for...of` (unidades 8–10) e tratamento de erros (unidade 12).

## Critérios de aceitação

- `node --test exercises/01-javascript-core/unit-24-json/exercises.test.js`
  sem falhas.
- Nenhuma função deixa um `JSON.parse` de entrada não confiável sem
  `try/catch` (ou equivalente).
- Você consegue explicar, sem consultar o código, por que
  `JSON.stringify` remove campos `undefined` e funções, mas transforma
  `NaN` e `Infinity` em `null`.
- Você consegue explicar o que é poluição de protótipo (prototype
  pollution) e por que aceitar chaves `__proto__` vindas de JSON externo
  sem filtro é perigoso.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
