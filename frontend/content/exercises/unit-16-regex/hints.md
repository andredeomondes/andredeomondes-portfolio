# Dicas — Unidade 16

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `extractNumbers`: qual método de string, combinado com a flag
  `g`, retorna **todas** as ocorrências de um padrão, não só a primeira?
- Para `maskCreditCard`: pense em "todo dígito seguido de pelo menos 4
  outros dígitos" — que construção de regex olha para frente sem
  "consumir" o que vem depois (`lookahead`)?
- Para `countWordOccurrences`: o que `\b` significa antes e depois de uma
  palavra? Por que `cat` sem `\b` também bateria dentro de `category`?
- Para `slugify`: depois de trocar tudo que não é letra/número por
  hífen, você pode acabar com hífens duplicados ou nas pontas. Que
  padrão limpa isso — um só, ou dois replace() separados?
- Para `extractDateParts`: grupos nomeados usam a sintaxe
  `(?<nome>padrão)`. Onde você acessa esses nomes depois de um `.match()`
  bem-sucedido?
- Para `isValidPhoneNumber` (debugging): teste mentalmente a regex atual
  contra `"abc123-456-7890xyz"` sem `^`/`$` — ela encontra o padrão em
  algum lugar no meio da string?

## Nível 2 — pista mais direta

- `extractNumbers`: `str.match(/\d+/g)` retorna um array de strings (ou
  `null` se não houver nenhuma) — depois é só mapear cada uma para
  `Number(...)`.
- `maskCreditCard`: `str.replace(/\d(?=\d{4})/g, "*")` substitui cada
  dígito que tem 4 dígitos à frente por `*`, preservando os 4 últimos.
- `countWordOccurrences`: `new RegExp(`\\b${word}\\b`, "gi")` e depois
  conte os matches com `.match(...)?.length ?? 0`.
- `slugify`: `str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")`
  resolve em duas etapas — troca por hífen, depois apara as pontas.
- `extractDateParts`: `const match = str.match(/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/);`
  e depois `match ? { year: Number(match.groups.year), ... } : null`.
- `isValidPhoneNumber`: adicione `^` no início e `$` no final do padrão
  atual — isso obriga a string **inteira** a bater, não só um pedaço
  dela.
- `extractAllPrices`: adicione a flag `g` à regex e troque `.match()`
  para capturar todas as ocorrências (com `g`, `.match()` já retorna
  todos os matches completos, mas sem grupos de captura individuais).

## Nível 3 — quase o código, mas ainda não a solução

- `parseQueryString`:
  ```js
  export function parseQueryString(str) {
    if (!str) return {};
    const result = {};
    for (const pair of str.split("&")) {
      const [key, value] = pair.split("=");
      result[key] = value;
    }
    return result;
  }
  ```
  (dá para fazer com regex e `matchAll`, mas `split` já resolve bem aqui
  — pense se regex é realmente necessário para *todo* problema.)
- `replaceTemplateVars`:
  ```js
  export function replaceTemplateVars(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : "";
    });
  }
  ```
- `messyValidateUsername` (refatoração): um único padrão pode expressar
  "começa com letra, só letras/números/underscore depois, comprimento
  total 3-16":
  `/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/` — mas ele ainda não cobre a regra de
  "sem underscore duplo"; combine esse padrão com um segundo teste
  (`!/__/.test(str)`), só que agora com apenas dois testes em vez de
  cinco.
- `parseLogLine`: um padrão como
  `/^\[(?<timestamp>[^\]]+)\]\s+(?<level>\w+):\s+(?<message>.+?)\s*#(?<orderId>\d+)$/`
  captura os quatro campos de uma vez; `match.groups` já vem no formato
  certo, só falta decidir o que fazer quando `match` é `null`.

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
