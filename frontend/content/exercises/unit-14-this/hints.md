# Dicas — Unidade 14

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `createPerson`/`extractAndCallLoosely`: `this` de um método comum
  é decidido em **tempo de chamada**, olhando o que está à esquerda do
  ponto. Se não há nada à esquerda do ponto, o que sobra?
- Para `bindMethodToObject`: `.bind()` não chama a função — ele retorna
  uma **nova função** com `this` permanentemente fixado. Qual a
  diferença entre `fn.bind(obj)` e `fn.bind(obj)()`?
- Para `sumWithCall`/`sumWithApply`: os dois fazem a mesma coisa
  (definem `this` e chamam a função). A única diferença está em como os
  demais argumentos são passados — pense no formato de cada assinatura.
- Para `createArrowCounter`: uma arrow function "olha para fora" para
  descobrir seu `this`. Se ela é criada dentro de um método comum, de
  quem ela herda o `this`?
- Para `bindAllMethods`: como você percorre todas as chaves de um objeto
  e verifica, uma a uma, se o valor é uma função?
- Para `sumArrayWithContext` (debugging): `Array.prototype.forEach`
  aceita um segundo argumento além do callback. Você sabe o que ele faz?

## Nível 2 — pista mais direta

- `extractAndCallLoosely`: em modo estrito (todo módulo ES é estrito),
  chamar uma função solta faz `this` valer `undefined` dentro dela — não
  `globalThis`. Tentar ler `this.algumaCoisa` nessas condições lança
  `TypeError`.
- `borrowArrayMethod`: `Array.prototype.slice.call(arrayLike)` funciona
  porque `slice` só precisa que `this` tenha `length` e índices — não
  precisa ser de fato um array.
- `createEventBus`: ao invocar cada handler dentro de `emit`, use
  `handler.call(this, ...args)` — dentro de `emit`, `this` já é o bus,
  então basta repassar.
- `sumArrayWithContext`: `obj.numbers.forEach(function (n) { ... }, obj)`
  — o segundo argumento de `forEach` define o `this` usado dentro do
  callback.
- `BuggyCounter`: `getIncrementFunction` retorna `this.increment` sem
  vínculo. Qual método já visto nesta unidade "gruda" permanentemente um
  `this` numa função?
- `Widget` (refatoração): `Object.getOwnPropertyNames(Object.getPrototypeOf(this))`
  lista os nomes dos métodos definidos na classe (inclusive
  `constructor`). Um `for` sobre esse array, pulando `"constructor"`,
  pode religar cada método.

## Nível 3 — quase o código, mas ainda não a solução

- `bindAllMethods`:
  ```js
  export function bindAllMethods(obj) {
    const result = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      result[key] = typeof value === "function" ? value.bind(obj) : value;
    }
    return result;
  }
  ```
- `createArrowCounter`:
  ```js
  export function createArrowCounter() {
    return {
      count: 0,
      incrementLater() {
        const tick = () => {
          this.count++;
          return this.count;
        };
        return tick();
      },
    };
  }
  ```
- `sumArrayWithContext` (uma correção possível): trocar a função comum
  por uma arrow function, que herda o `this` do escopo de
  `sumArrayWithContext` — mas repare que, nesse caso, `this` da própria
  função `sumArrayWithContext` também não é `obj`. A correção mais direta
  é usar o segundo argumento de `forEach`, ou trocar `this.total` por
  `obj.total` dentro de uma arrow function.
- `Widget` (refatoração):
  ```js
  constructor(label) {
    this.label = label;
    this.clicks = 0;
    for (const name of Object.getOwnPropertyNames(Widget.prototype)) {
      if (name !== "constructor" && typeof this[name] === "function") {
        this[name] = this[name].bind(this);
      }
    }
  }
  ```
- `createRateLimiter`:
  ```js
  export function createRateLimiter(limit) {
    const state = { count: 0, limit };
    state.attempt = function () {
      if (this.count >= this.limit) return false;
      this.count++;
      return true;
    }.bind(state);
    state.reset = function () {
      this.count = 0;
    }.bind(state);
    return state;
  }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
