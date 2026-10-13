import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createRectangleClass,
  createStackClass,
  createCounterClass,
  createAnimalAndDogClasses,
  getPrototypeChain,
  createTemperatureClass,
  createIdGeneratorClass,
  withTimestamps,
  createShapeClasses,
  createEventEmitterClass,
  definePrototypeMethod,
  createLinkedListClass,
  ShoppingCart,
  Vector,
  Order,
  createInventoryClass,
} from "./exercises.js";

// --- createRectangleClass -----------------------------------------------------

test("createRectangleClass: area, perímetro e isSquare", () => {
  const Rectangle = createRectangleClass();
  const r = new Rectangle(3, 4);
  assert.equal(r.area(), 12);
  assert.equal(r.perimeter(), 14);
  assert.equal(r.isSquare(), false);
  assert.equal(new Rectangle(5, 5).isSquare(), true);
});

// --- createStackClass ----------------------------------------------------------

test("createStackClass: push, pop, peek, size, isEmpty", () => {
  const Stack = createStackClass();
  const s = new Stack();
  assert.equal(s.isEmpty(), true);
  s.push(1);
  s.push(2);
  assert.equal(s.peek(), 2);
  assert.equal(s.size(), 2);
  assert.equal(s.pop(), 2);
  assert.equal(s.size(), 1);
  assert.equal(s.isEmpty(), false);
});

// --- createCounterClass --------------------------------------------------------

test("createCounterClass: increment, decrement e getter value", () => {
  const Counter = createCounterClass();
  const c = new Counter(5);
  assert.equal(c.increment(), 6);
  assert.equal(c.increment(4), 10);
  assert.equal(c.decrement(3), 7);
  assert.equal(c.value, 7);
});

// --- createAnimalAndDogClasses --------------------------------------------------

test("createAnimalAndDogClasses: herança com super()", () => {
  const { Animal, Dog } = createAnimalAndDogClasses();
  const d = new Dog("Rex");
  assert.equal(d.speak(), "Rex faz Au au");
  assert.equal(d.fetch(), "Rex busca a bolinha");
  assert.ok(d instanceof Animal);
  assert.ok(d instanceof Dog);
});

// --- getPrototypeChain -----------------------------------------------------------

test("getPrototypeChain: percorre a cadeia de protótipos até Object", () => {
  class Base {}
  class Mid extends Base {}
  class Leaf extends Mid {}
  assert.deepEqual(getPrototypeChain(new Leaf()), ["Leaf", "Mid", "Base", "Object"]);
});

// --- createTemperatureClass -------------------------------------------------------

test("createTemperatureClass: getters e setters convertem celsius/fahrenheit", () => {
  const Temperature = createTemperatureClass();
  const t = new Temperature(0);
  assert.equal(t.fahrenheit, 32);
  t.fahrenheit = 212;
  assert.equal(t.celsius, 100);
});

// --- createIdGeneratorClass ---------------------------------------------------------

test("createIdGeneratorClass: static next() incrementa e reset() zera", () => {
  const IdGenerator = createIdGeneratorClass();
  IdGenerator.reset();
  assert.equal(IdGenerator.next(), 1);
  assert.equal(IdGenerator.next(), 2);
  IdGenerator.reset();
  assert.equal(IdGenerator.next(), 1);
});

// --- withTimestamps ------------------------------------------------------------------

test("withTimestamps: mixin adiciona createdAt sem quebrar a classe base", () => {
  class Plain {
    constructor(x) {
      this.x = x;
    }
  }
  const Timestamped = withTimestamps(Plain);
  const inst = new Timestamped(5);
  assert.equal(inst.x, 5);
  assert.equal(typeof inst.createdAt, "string");
  assert.ok(inst instanceof Plain);
});

// --- createShapeClasses --------------------------------------------------------------

test("createShapeClasses: polimorfismo entre formas e totalArea", () => {
  const { Shape, Circle, Square, totalArea } = createShapeClasses();
  assert.throws(() => new Shape().area());
  const circle = new Circle(2);
  const square = new Square(3);
  assert.ok(Math.abs(circle.area() - Math.PI * 4) < 1e-9);
  assert.equal(square.area(), 9);
  const total = totalArea([circle, square]);
  assert.ok(Math.abs(total - (Math.PI * 4 + 9)) < 1e-9);
});

// --- createEventEmitterClass ----------------------------------------------------------

test("createEventEmitterClass: on, emit e off", () => {
  const EventEmitter = createEventEmitterClass();
  const emitter = new EventEmitter();
  const received = [];
  const handler = (value) => received.push(value);

  emitter.on("tick", handler);
  emitter.emit("tick", 1);
  emitter.emit("tick", 2);
  assert.deepEqual(received, [1, 2]);

  emitter.off("tick", handler);
  emitter.emit("tick", 3);
  assert.deepEqual(received, [1, 2]);
});

// --- definePrototypeMethod ---------------------------------------------------------

test("definePrototypeMethod: adiciona método diretamente no protótipo", () => {
  class Empty {}
  definePrototypeMethod(Empty, "greet", function () {
    return "oi " + this.constructor.name;
  });
  const instance = new Empty();
  assert.equal(instance.greet(), "oi Empty");
});

// --- createLinkedListClass ------------------------------------------------------------

test("createLinkedListClass: append encadeado e toArray", () => {
  const LinkedList = createLinkedListClass();
  const list = new LinkedList();
  list.append(1).append(2).append(3);
  assert.deepEqual(list.toArray(), [1, 2, 3]);
});

// --- ShoppingCart --------------------------------------------------------------------

test("ShoppingCart: addItem adiciona ao carrinho corretamente", () => {
  const cart = new ShoppingCart();
  cart.addItem({ name: "teclado", price: 150 });
  cart.addItem({ name: "mouse", price: 50 });
  assert.equal(cart.items.length, 2);
  assert.equal(cart.getTotal(), 200);
});

// --- Vector ------------------------------------------------------------------------

test("Vector: add soma os componentes dos dois vetores", () => {
  const a = new Vector(1, 2);
  const b = new Vector(3, 4);
  const result = a.add(b);
  assert.equal(result.x, 4);
  assert.equal(result.y, 6);
});

// --- Order -------------------------------------------------------------------------

test("Order: summary mantém o mesmo texto de saída após a refatoração", () => {
  assert.equal(new Order("pending", 50).summary(), "Pedido pendente: R$50");
  assert.equal(
    new Order("pending", 150).summary(),
    "Pedido pendente de alto valor: R$150",
  );
  assert.equal(new Order("paid", 80).summary(), "Pedido pago: R$80");
  assert.equal(new Order("paid", 500).summary(), "Pedido pago de alto valor: R$500");
  assert.equal(new Order("cancelled", 20).summary(), "Pedido cancelado: R$20");
  assert.equal(new Order("refunded", 10).summary(), "Status desconhecido: R$10");
});

// --- createInventoryClass -------------------------------------------------------------

test("createInventoryClass: combina classes com map/filter/reduce", () => {
  const Inventory = createInventoryClass();
  const inventory = new Inventory();
  inventory.addProduct({ id: 1, name: "Mouse", price: 50, category: "perifericos" });
  inventory.addProduct({ id: 2, name: "Teclado", price: 150, category: "perifericos" });
  inventory.addProduct({ id: 3, name: "Monitor", price: 800, category: "video" });

  assert.equal(inventory.totalValue(), 1000);
  assert.deepEqual(
    inventory.filterByCategory("perifericos").map((p) => p.id),
    [1, 2],
  );
  assert.equal(inventory.mostExpensive().name, "Monitor");

  inventory.removeProduct(3);
  assert.equal(inventory.totalValue(), 200);
});
