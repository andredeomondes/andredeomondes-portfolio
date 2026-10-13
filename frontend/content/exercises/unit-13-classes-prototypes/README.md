# Unidade 13 — Classes e protótipos

Fase 1, Unidade 13. Cobre: `class`, `constructor`, herança com `extends`
e `super`, getters/setters, métodos e propriedades `static`, mixins, e o
que existe "por baixo dos panos" quando você usa `class` — protótipos,
`Object.getPrototypeOf`, e como um método vive no `prototype` do
construtor em vez de em cada instância.

## Antes de começar

Responda por escrito (pode ser neste README, numa cópia local, ou em
`notes/concepts/` se quiser guardar):

1. Quando você chama `new Dog("Rex")` numa classe `Dog extends Animal`,
   em que ordem as coisas acontecem: o construtor de `Dog` roda primeiro,
   ou o de `Animal`?
2. Se duas instâncias da mesma classe compartilham um método, esse método
   é copiado para cada instância ou vive em um lugar só? Onde?
3. Qual a diferença prática entre um método de instância e um método
   `static`?

Não pesquise ainda. Escreva sua hipótese antes de implementar qualquer
função — você vai comparar com o resultado real ao rodar os testes.

## Como trabalhar

1. Abra `exercises.js`. O primeiro exercício (`createRectangleClass`) já
   vem resolvido como exemplo de estilo — leia com atenção antes de
   seguir.
2. Os demais exercícios têm `throw new Error("not implemented: <nome>")`.
3. **Convenção desta unidade**: quando o exercício pede uma classe, a
   função exportada é uma "fábrica" que você implementa para **retornar**
   a classe (em vez de exportar a classe diretamente). Isso mantém o
   mesmo padrão de "not implemented" das outras unidades.
4. Rode os testes:

   ```bash
   node --test exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
   ```

5. Todos os testes começam falhando (exceto os que já vêm com bug
   proposital nas seções de debugging, e o primeiro exercício, que já
   está implementado). Isso é esperado.
6. Não use bibliotecas externas.

## Exercícios fundamentais (8)

1. **`createRectangleClass()`** — retorna uma classe `Rectangle` com
   `constructor(width, height)`, `area()`, `perimeter()` e
   `isSquare()`. **Já implementado como exemplo.**
2. **`createStackClass()`** — retorna uma classe `Stack` com `push(item)`
   (empilha), `pop()` (desempilha e retorna o topo), `peek()` (lê o topo
   sem remover), `isEmpty()` e `size()`.
3. **`createCounterClass()`** — retorna uma classe `Counter` com
   `constructor(start = 0)`, `increment(step = 1)`, `decrement(step = 1)`
   (ambos retornam o novo valor) e um getter `value`.
4. **`createAnimalAndDogClasses()`** — retorna `{ Animal, Dog }`.
   `Animal` tem `constructor(name, sound)` e método `speak()` que retorna
   `"<name> faz <sound>"`. `Dog extends Animal`, com
   `constructor(name)` chamando `super(name, "Au au")`, e método extra
   `fetch()` que retorna `"<name> busca a bolinha"`.
5. **`getPrototypeChain(obj)`** — recebe uma instância qualquer e retorna
   um array com o nome de cada construtor na cadeia de protótipos, do
   mais específico ao mais genérico, terminando sempre em `"Object"`.
   Use `Object.getPrototypeOf`.
6. **`createTemperatureClass()`** — retorna uma classe `Temperature` com
   `constructor(celsius = 0)`, getter/setter `celsius` e getter/setter
   `fahrenheit` (a leitura/escrita em `fahrenheit` converte
   automaticamente para/de `celsius`).
7. **`createIdGeneratorClass()`** — retorna uma classe `IdGenerator` com
   um contador **estático**: `IdGenerator.next()` retorna um id
   incremental começando em `1`, e `IdGenerator.reset()` zera o contador.
8. **`withTimestamps(BaseClass)`** — função (não é fábrica de classe
   isolada, recebe uma classe existente) que retorna uma **nova classe**
   estendendo `BaseClass`, cujo construtor repassa todos os argumentos
   para `super(...args)` e além disso define `this.createdAt` como uma
   string (`new Date().toISOString()`). Este é o padrão de "mixin" —
   compor comportamento sem alterar a classe original.

## Exercícios intermediários (4)

9. **`createShapeClasses()`** — retorna
   `{ Shape, Circle, Square, totalArea }`. `Shape` tem um método
   `area()` que lança `Error` (classe-base "abstrata"). `Circle extends
   Shape` (`constructor(radius)`) e `Square extends Shape`
   (`constructor(side)`) implementam `area()` de verdade. `totalArea(shapes)`
   é uma função que recebe um array de instâncias de `Shape` (de
   qualquer subclasse) e retorna a soma das áreas — isso é polimorfismo:
   a função não sabe (nem precisa saber) se cada item é um `Circle` ou um
   `Square`.
10. **`createEventEmitterClass()`** — retorna uma classe `EventEmitter`
    com `on(event, handler)`, `off(event, handler)` e
    `emit(event, ...args)`, que chama todos os handlers registrados para
    aquele evento, na ordem em que foram registrados.
11. **`definePrototypeMethod(Ctor, name, fn)`** — recebe um construtor
    (função ou classe), um nome de método e uma função, e adiciona `fn`
    como método em `Ctor.prototype[name]`. Isso demonstra, na prática, o
    que a sintaxe `class { metodo() {} }` faz por baixo dos panos.
12. **`createLinkedListClass()`** — retorna uma classe `LinkedList` com
    `append(value)` (adiciona ao final e retorna a própria lista, para
    permitir encadear chamadas) e `toArray()` (retorna um array com os
    valores na ordem). Use uma classe interna `Node` (ou objeto simples)
    para representar cada nó.

## Debugging (2)

13. **`ShoppingCart`** — a classe já está implementada, mas
    `addItem(item)` lança `ReferenceError: items is not defined` em vez
    de adicionar o item ao carrinho. Corrija sem mudar a assinatura.
14. **`Vector`** — a classe já está implementada, mas `add(other)` sempre
    retorna o dobro do vetor atual, ignorando completamente `other`.
    Corrija para que a soma vetorial funcione de verdade.

## Refatoração (1)

15. **`Order`** — o método `summary()` já funciona corretamente, mas tem
    lógica duplicada (a checagem de "alto valor" é repetida para
    `"pending"` e `"paid"`) e vários níveis de `if/else` aninhados.
    Refatore para reduzir a duplicação, mantendo exatamente as mesmas
    strings de saída para as mesmas entradas.

## Desafio integrador (1)

16. **`createInventoryClass()`** — retorna uma classe `Inventory` que
    combina classes com funções de alta ordem (vistas em unidades
    anteriores):
    - `addProduct(product)` — adiciona `{ id, name, price, category }`
      à lista interna;
    - `removeProduct(id)` — remove pelo `id`;
    - `totalValue()` — soma o `price` de todos os produtos (`reduce`);
    - `filterByCategory(category)` — retorna os produtos daquela
      categoria (`filter`);
    - `mostExpensive()` — retorna o produto de maior `price`.

## Critérios de aceitação

- Os testes da unidade passam sem falhas.
- Você consegue explicar, sem consultar o código, por que dois métodos de
  instância da mesma classe são, na verdade, a mesma função compartilhada
  via protótipo — e não duas cópias.
- Você entende a diferença entre um método de instância e um método
  `static`, e sabe dizer quando usar cada um.

## Dicas

Peça `DICA_1`, `DICA_2` ou `DICA_3` quando travar em um exercício
específico — ou veja `hints.md` para o roteiro geral por nível.

Não peça `MOSTRAR_SOLUCAO` antes de tentar de verdade.
