// Unidade 13 — Classes e protótipos
//
// Implemente cada função. Não use bibliotecas externas.
// Veja README.md para o enunciado completo de cada exercício.
//
// Convenção desta unidade: quando o exercício pede uma classe, a função
// exportada é uma "fábrica" que RETORNA a classe (em vez de exportar a
// classe diretamente). Isso mantém o mesmo padrão de "not implemented"
// usado nas outras unidades — você implementa o corpo da função para que
// ela devolva a classe pronta.

// --- Fundamentais ---------------------------------------------------------

// test: node --test --test-name-pattern="createRectangleClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createRectangleClass() {
  return class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    area() {
      return this.width * this.height;
    }

    perimeter() {
      return 2 * (this.width + this.height);
    }

    isSquare() {
      return this.width === this.height;
    }
  };
}

// test: node --test --test-name-pattern="createStackClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createStackClass() {
  throw new Error("not implemented: createStackClass");
}

// test: node --test --test-name-pattern="createCounterClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createCounterClass() {
  throw new Error("not implemented: createCounterClass");
}

// test: node --test --test-name-pattern="createAnimalAndDogClasses" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createAnimalAndDogClasses() {
  throw new Error("not implemented: createAnimalAndDogClasses");
}

// test: node --test --test-name-pattern="getPrototypeChain" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function getPrototypeChain(obj) {
  throw new Error("not implemented: getPrototypeChain");
}

// test: node --test --test-name-pattern="createTemperatureClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createTemperatureClass() {
  throw new Error("not implemented: createTemperatureClass");
}

// test: node --test --test-name-pattern="createIdGeneratorClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createIdGeneratorClass() {
  throw new Error("not implemented: createIdGeneratorClass");
}

// test: node --test --test-name-pattern="withTimestamps" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function withTimestamps(BaseClass) {
  throw new Error("not implemented: withTimestamps");
}

// --- Intermediários --------------------------------------------------------

// test: node --test --test-name-pattern="createShapeClasses" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createShapeClasses() {
  throw new Error("not implemented: createShapeClasses");
}

// test: node --test --test-name-pattern="createEventEmitterClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createEventEmitterClass() {
  throw new Error("not implemented: createEventEmitterClass");
}

// test: node --test --test-name-pattern="definePrototypeMethod" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function definePrototypeMethod(Ctor, name, fn) {
  throw new Error("not implemented: definePrototypeMethod");
}

// test: node --test --test-name-pattern="createLinkedListClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createLinkedListClass() {
  throw new Error("not implemented: createLinkedListClass");
}

// --- Debugging --------------------------------------------------------------
//
// As duas classes abaixo JÁ ESTÃO IMPLEMENTADAS, mas contêm um bug real.
// Sua tarefa não é reescrever do zero: é diagnosticar e corrigir.

// test: node --test --test-name-pattern="ShoppingCart" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export class ShoppingCart {
  // Sintoma relatado: chamar `addItem` lança
  // "ReferenceError: items is not defined" em vez de adicionar o item.
  constructor() {
    this.items = [];
  }

  addItem(item) {
    items.push(item);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// test: node --test --test-name-pattern="Vector" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export class Vector {
  // Sintoma relatado: somar dois vetores diferentes sempre produz um
  // resultado como se o segundo vetor fosse igual ao primeiro (dobro de x
  // e dobro de y do primeiro vetor, ignorando o segundo).
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector(this.x + this.x, this.y + this.y);
  }
}

// --- Refatoração -------------------------------------------------------------
//
// Esta classe já funciona corretamente. A tarefa é refatorar para reduzir
// duplicação e aninhamento, mantendo o mesmo comportamento observável
// (as mesmas strings de saída para as mesmas entradas).

// test: node --test --test-name-pattern="Order" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export class Order {
  constructor(status, total) {
    this.status = status;
    this.total = total;
  }

  summary() {
    if (this.status === "pending") {
      if (this.total > 100) {
        return "Pedido pendente de alto valor: R$" + this.total;
      } else {
        return "Pedido pendente: R$" + this.total;
      }
    } else if (this.status === "paid") {
      if (this.total > 100) {
        return "Pedido pago de alto valor: R$" + this.total;
      } else {
        return "Pedido pago: R$" + this.total;
      }
    } else if (this.status === "cancelled") {
      return "Pedido cancelado: R$" + this.total;
    } else {
      return "Status desconhecido: R$" + this.total;
    }
  }
}

// --- Desafio integrador -------------------------------------------------------

// test: node --test --test-name-pattern="createInventoryClass" exercises/01-javascript-core/unit-13-classes-prototypes/exercises.test.js
export function createInventoryClass() {
  throw new Error("not implemented: createInventoryClass");
}
