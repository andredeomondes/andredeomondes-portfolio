# Dicas — Unidade 13

Use `DICA_1`, `DICA_2` ou `DICA_3` dizendo qual exercício travou. Abaixo
está o roteiro geral que a mentoria segue nesta unidade.

## Nível 1 — direção, sem código

- Para `createStackClass`: uma pilha (stack) segue a regra LIFO (último a
  entrar, primeiro a sair). Que método de array já se comporta assim nas
  duas pontas?
- Para `createAnimalAndDogClasses`: `super(...)` precisa ser a primeira
  linha do construtor de uma subclasse. O que acontece se você tentar
  usar `this` antes de chamar `super`?
- Para `getPrototypeChain`: `Object.getPrototypeOf(instancia)` retorna o
  quê exatamente — a classe, ou o `prototype` da classe? E
  `Object.getPrototypeOf(Classe.prototype)` retorna o quê?
- Para `createTemperatureClass`: escreva primeiro, em papel, as duas
  fórmulas de conversão (C→F e F→C) antes de decidir onde armazenar o
  valor "de verdade" internamente.
- Para `withTimestamps`: uma classe pode estender uma classe que só é
  conhecida em tempo de execução (recebida como parâmetro)? O que
  `class X extends BaseClass` exige de `BaseClass`?
- Para `createShapeClasses`: pense em por que `totalArea` não precisa
  de nenhum `if (shape instanceof Circle)` — o que garante que
  `shape.area()` "simplesmente funciona" para qualquer subclasse?

## Nível 2 — pista mais direta

- `createStackClass`: `push`/`pop` de array já fazem o trabalho; a classe
  é uma casca fina em volta de um array interno (`this._items`).
- `createEventEmitterClass`: guarde os handlers num objeto/Map de
  `evento -> array de funções`. `off` precisa remover exatamente a
  referência de função passada (`Array.prototype.filter` ajuda).
- `definePrototypeMethod`: `Ctor.prototype[name] = fn;` — depois disso,
  toda instância criada com `new Ctor()` (inclusive as já existentes,
  já que protótipo é compartilhado) ganha o método.
- `ShoppingCart` (debugging): rode `addItem` mentalmente. `items` sem
  `this.` na frente se refere a quê? Existe alguma variável `items`
  visível naquele escopo?
- `Vector` (debugging): compare `this.x + this.x` com o que deveria ser
  somado. O parâmetro `other` está sendo usado em algum lugar do método?
- `Order` (refatoração): tanto `"pending"` quanto `"paid"` têm a mesma
  lógica de "se total > 100, sufixo de alto valor". Dá para extrair essa
  decisão para uma variável ou função auxiliar chamada uma vez, e separar
  só o *rótulo* do status (`"pendente"` vs `"pago"`) num mapa.

## Nível 3 — quase o código, mas ainda não a solução

- `createTemperatureClass`: armazene sempre `_celsius` internamente. O
  getter `fahrenheit` retorna `this._celsius * 9/5 + 32`; o setter
  `fahrenheit` faz `this._celsius = (value - 32) * 5/9`.
- `createIdGeneratorClass`: um campo estático (`static #count = 0` ou
  `static count = 0`) é compartilhado por todas as chamadas de
  `next()`, porque pertence à classe, não à instância.
- `withTimestamps`:
  ```js
  export function withTimestamps(BaseClass) {
    return class extends BaseClass {
      constructor(...args) {
        super(...args);
        this.createdAt = new Date().toISOString();
      }
    };
  }
  ```
- `createLinkedListClass`: `append` cria um nó `{ value, next: null }`,
  anda até o último nó existente (ou define `this.head` se a lista
  estiver vazia) e liga o `next` dele ao novo nó; retorne `this` no
  final para permitir encadear `.append().append()`.
- `Order` (refatoração):
  ```js
  const labels = { pending: "pendente", paid: "pago" };
  const label = labels[this.status];
  if (label) {
    const suffix = this.total > 100 ? " de alto valor" : "";
    return `Pedido ${label}${suffix}: R$${this.total}`;
  }
  if (this.status === "cancelled") return `Pedido cancelado: R$${this.total}`;
  return `Status desconhecido: R$${this.total}`;
  ```

Peça `MOSTRAR_SOLUCAO` apenas depois de registrar sua tentativa.
