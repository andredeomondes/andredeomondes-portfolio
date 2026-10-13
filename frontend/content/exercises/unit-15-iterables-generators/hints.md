# Dicas — Unidade 15

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `isIterable`: qual expressão testa "esse objeto tem uma função
  guardada na chave computada `Symbol.iterator`"? Cuidado com `null` —
  acessar uma propriedade de `null` lança erro.
- Para `take`: o generator não sabe, de antemão, se o iterável recebido é
  finito ou infinito. Como ele decide quando parar, então?
- Para `fibonacciGenerator`: quantas variáveis "de estado" você precisa
  guardar entre uma chamada de `yield` e a próxima para saber o próximo
  número da sequência?
- Para `sumFirstN`: `generatorFn()` retorna um objeto iterador. Que
  método desse objeto você chama repetidamente, e o que ele devolve a
  cada chamada?
- Para `createLinkedListIterable`: o objeto retornado precisa de um
  método especial (chave computada) para que `for...of` funcione nele
  diretamente — qual?
- Para `brokenRange` (debugging): compare a ordem de `i++` e `yield i` no
  código atual. Se você trocar a ordem, o que muda no primeiro valor
  gerado?

## Nível 2 — pista mais direta

- `take`: dentro de um `function*`, um `for...of` sobre o iterável de
  entrada, com um contador que faz `return` (ou `break`) assim que
  atingir `n` — `return` dentro de um generator encerra ele
  definitivamente.
- `zipGenerators`: chame `.next()` manualmente nos dois iteradores (via
  `iterA[Symbol.iterator]()` e `iterB[Symbol.iterator]()`) dentro de um
  `while`, parando quando qualquer um dos dois retornar `done: true`.
- `createPaginatedCollection`: dentro de `[Symbol.iterator]()`, use
  `Array.prototype.slice` para cortar `items` em pedaços de `pageSize`,
  fazendo `yield` de cada pedaço (isso pode ser um `function*` interno
  chamado a partir de `[Symbol.iterator]()`).
- `brokenTakeEvery`: o índice está sendo incrementado **antes** de
  checar se é par. Isso desloca todos os índices em um. Mover o
  incremento para depois do `yield`, ou comparar antes de incrementar,
  resolve.
- `messyPipeline` (refatoração): `take(filterGenerator(mapGenerator(numbers, x => x * 2), x => x % 2 === 0), 3)`
  substitui os três laços manuais — mas você pode preferir uma versão
  ainda mais direta com um único `function*` e `for...of`.

## Nível 3 — quase o código, mas ainda não a solução

- `fibonacciGenerator`:
  ```js
  export function* fibonacciGenerator() {
    let [a, b] = [0, 1];
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }
  ```
- `sumFirstN`:
  ```js
  export function sumFirstN(generatorFn, n) {
    const iterator = generatorFn();
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const { value, done } = iterator.next();
      if (done) break;
      sum += value;
    }
    return sum;
  }
  ```
- `createLinkedListIterable`:
  ```js
  export function createLinkedListIterable() {
    let head = null;
    let tail = null;
    return {
      append(value) {
        const node = { value, next: null };
        if (!head) { head = tail = node; } else { tail.next = node; tail = node; }
        return this;
      },
      [Symbol.iterator]() {
        let current = head;
        return {
          next() {
            if (!current) return { value: undefined, done: true };
            const { value } = current;
            current = current.next;
            return { value, done: false };
          },
        };
      },
    };
  }
  ```
- `brokenRange`: troque
  ```js
  while (i < end) { i++; yield i; }
  ```
  por
  ```js
  while (i <= end) { yield i; i++; }
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
