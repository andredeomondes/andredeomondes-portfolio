# Dicas — Unidade 24

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `toJsonString`/`prettyJsonString`: `JSON.stringify` aceita três
  parâmetros. O terceiro controla o quê exatamente?
- Para `parseJsonOrDefault`/`isValidJson`: `JSON.parse` de uma string
  inválida faz o quê — retorna `undefined`, ou lança uma exceção? Isso
  muda como você precisa estruturar o código.
- Para `stripUndefinedFields`: o que `JSON.stringify` já faz sozinho com
  chaves cujo valor é `undefined`? Existe algum jeito de aproveitar isso
  em vez de filtrar manualmente as chaves?
- Para `roundTripEquality`: compare o *valor* antes e depois do
  round-trip, não a string JSON dos dois lados — comparar strings sempre
  daria "igual" mesmo quando a estrutura mudou de tipo. O que
  `assert.deepEqual` (ou uma comparação sua equivalente) revela que a
  comparação de strings esconderia?
- Para `deepCloneViaJson`: por que `{ ...obj }` (spread raso) não seria
  suficiente para uma cópia "profunda"? O que aconteceria com um campo
  aninhado se você usasse spread raso?
- Para `jsonStringByteSize`: `.length` de uma string conta *caracteres*.
  `Buffer.byteLength` conta o quê?
- Para `maskSensitiveFields`: o segundo parâmetro de `JSON.stringify`
  (`replacer`) é chamado uma vez para **cada** par chave/valor, inclusive
  aninhado — isso já resolve o "em qualquer profundidade" sem você
  precisar escrever recursão manual.
- Para `reviveDates`: o terceiro parâmetro de `JSON.parse` (`reviver`)
  também é chamado para cada par chave/valor, de baixo para cima
  (primeiro os valores mais profundos). Como você reconheceria uma string
  que "parece uma data ISO" dentro dele?
- Para `parseNdjson`: cada linha do texto é um JSON independente. Como
  você separa um texto em linhas?
- Para `safeMerge`: por que aceitar uma chave `__proto__` vinda de JSON
  externo sem filtrar é perigoso? Pesquise (mentalmente, antes de
  implementar) o que essa chave especial faz quando atribuída num objeto
  comum.
- Para `serializeUserProfileBuggy`: `JSON.stringify` tem um jeito de
  excluir campos específicos sem você precisar criar um objeto novo à
  mão primeiro — qual dos três parâmetros permite isso?
- Para `parseConfigBuggy`: onde exatamente o `JSON.parse` dessa função
  deveria estar protegido, e o que deveria acontecer no lugar da exceção?

## Nível 2 — pista mais direta

- `toJsonString`: `JSON.stringify(value)`.
- `prettyJsonString`: `JSON.stringify(value, null, 2)`.
- `parseJsonOrDefault`:
  ```js
  try {
    return JSON.parse(text);
  } catch {
    return defaultValue;
  }
  ```
- `stripUndefinedFields`: `JSON.parse(JSON.stringify(obj))` já remove
  chaves `undefined` — mas cuidado, isso também converte outros valores
  (leia o próximo exercício antes de decidir se essa é a abordagem certa
  para todo tipo de objeto).
- `isValidJson`: mesma estrutura de `parseJsonOrDefault`, mas retornando
  booleano em vez do valor.
- `roundTripEquality`: `const clone = JSON.parse(JSON.stringify(value));`
  depois compare `value` com `clone` estruturalmente (um `deepEqual`
  manual, ou reaproveite `assert.deepStrictEqual` só para pensar no
  critério — na implementação real você precisa de uma comparação sua,
  já que o exercício não pode depender do `assert` de teste).
- `deepCloneViaJson`: `return JSON.parse(JSON.stringify(value));`
- `jsonStringByteSize`: `Buffer.byteLength(JSON.stringify(value), "utf8")`.
- `maskSensitiveFields`:
  ```js
  const masked = JSON.stringify(obj, (key, value) =>
    sensitiveKeys.includes(key) ? "***" : value,
  );
  return JSON.parse(masked);
  ```
- `reviveDates`: um regex tipo
  `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/` testado dentro do
  `reviver` decide se converte a string em `new Date(value)`.
- `parseNdjson`: `text.split("\n").filter((line) => line.trim() !== "").map((line) => JSON.parse(line))`.
- `safeMerge`: faça o parse do patch dentro de um `try/catch` que lança
  `new Error("Invalid patch JSON: " + err.message)`; ao aplicar o merge,
  pule explicitamente a chave `"__proto__"` (`if (key === "__proto__") continue;`).
- `serializeUserProfileBuggy`: use o `replacer` de `JSON.stringify` para
  omitir `passwordHash`:
  ```js
  return JSON.stringify(user, (key, value) => (key === "passwordHash" ? undefined : value));
  ```
- `parseConfigBuggy`: envolva só o `JSON.parse(configText)` num
  `try/catch`; no `catch`, retorne `defaultConfig` diretamente.

## Nível 3 — quase o código, mas ainda não a solução

- `roundTripEquality` (comparação estrutural sem depender de bibliotecas
  de teste):
  ```js
  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;
    if (typeof a !== "object") return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => deepEqual(a[k], b[k]));
  }

  export function roundTripEquality(value) {
    const clone = JSON.parse(JSON.stringify(value));
    return deepEqual(value, clone);
  }
  ```
  Repare: `NaN` vira `null` no round-trip, e `typeof null === "object"`,
  então o `deepEqual` acima já trata isso como diferente de `NaN`
  original sem precisar de caso especial.
- `safeMerge`:
  ```js
  export function safeMerge(base, patchJsonText) {
    let patch;
    try {
      patch = JSON.parse(patchJsonText);
    } catch (err) {
      throw new Error(`Invalid patch JSON: ${err.message}`);
    }
    const result = { ...base };
    for (const key of Object.keys(patch)) {
      if (key === "__proto__") continue;
      result[key] = patch[key];
    }
    return result;
  }
  ```
- `refactorNormalizeApiResponse` (refatoração): a versão final troca a
  pirâmide de `if/else` por guard clauses sequenciais, na mesma ordem de
  prioridade da original (JSON inválido → não é objeto/array → é array →
  tem campo `error` → sucesso):
  ```js
  export function refactorNormalizeApiResponse(responseText) {
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return { ok: false, error: "invalid json", data: null };
    }
    if (data === null || typeof data !== "object") {
      return { ok: false, error: "expected an object or array", data: null };
    }
    if (Array.isArray(data)) {
      return { ok: true, error: null, data };
    }
    if (Object.prototype.hasOwnProperty.call(data, "error")) {
      return { ok: false, error: String(data.error), data: null };
    }
    return { ok: true, error: null, data };
  }
  ```
- `buildOrderReport`:
  ```js
  export function buildOrderReport(ordersJsonText) {
    let orders;
    try {
      orders = JSON.parse(ordersJsonText);
    } catch (err) {
      throw new Error(`Invalid orders JSON: ${err.message}`);
    }
    const byStatus = {};
    let totalRevenue = 0;
    for (const order of orders) {
      byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
      if (order.status === "paid") totalRevenue += order.amount;
    }
    return JSON.stringify(
      { totalOrders: orders.length, totalRevenue, byStatus },
      null,
      2,
    );
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
