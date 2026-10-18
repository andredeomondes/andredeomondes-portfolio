// Illustrative only: generic code and traffic, not taken from any client project.
export type IdeTone = "k" | "s" | "c" | "f" | "n" | "plain";
export type IdeToken = { text: string; tone: IdeTone };

export const ideScript: {
  file: string;
  tabs: string[];
  tree: string[];
  lines: IdeToken[][];
  requests: Array<{ method: string; path: string; status: string }>;
} = {
  file: "orders.service.ts",
  tabs: ["orders.service.ts", "checkout.ts"],
  tree: ["▾ app", "  ▾ src", "    api/", "    orders.service.ts", "    payments/", "    agents/", "  tests/", "  docker-compose.yml"],
  lines: [
    [{ text: "// cria pedido com idempotência e retry seguro", tone: "c" }],
    [
      { text: "export async function", tone: "k" },
      { text: " ", tone: "plain" },
      { text: "createOrder", tone: "f" },
      { text: "(input: ", tone: "plain" },
      { text: "OrderInput", tone: "n" },
      { text: ") {", tone: "plain" },
    ],
    [{ text: "  ", tone: "plain" }, { text: "const", tone: "k" }, { text: " key = ", tone: "plain" }, { text: "idempotencyKey", tone: "f" }, { text: "(input)", tone: "plain" }],
    [{ text: "  ", tone: "plain" }, { text: "const", tone: "k" }, { text: " cached = ", tone: "plain" }, { text: "await", tone: "k" }, { text: " redis.", tone: "plain" }, { text: "get", tone: "f" }, { text: "(key)", tone: "plain" }],
    [{ text: "  ", tone: "plain" }, { text: "if", tone: "k" }, { text: " (cached) ", tone: "plain" }, { text: "return", tone: "k" }, { text: " JSON.", tone: "plain" }, { text: "parse", tone: "f" }, { text: "(cached)", tone: "plain" }],
    [],
    [{ text: "  ", tone: "plain" }, { text: "return", tone: "k" }, { text: " db.", tone: "plain" }, { text: "transaction", tone: "f" }, { text: "(", tone: "plain" }, { text: "async", tone: "k" }, { text: " (tx) => {", tone: "plain" }],
    [{ text: "    ", tone: "plain" }, { text: "const", tone: "k" }, { text: " order = ", tone: "plain" }, { text: "await", tone: "k" }, { text: " tx.orders.", tone: "plain" }, { text: "insert", tone: "f" }, { text: "(input)", tone: "plain" }],
    [{ text: "    ", tone: "plain" }, { text: "await", tone: "k" }, { text: " queue.", tone: "plain" }, { text: "publish", tone: "f" }, { text: "(", tone: "plain" }, { text: "\"order.created\"", tone: "s" }, { text: ", order)", tone: "plain" }],
    [{ text: "    ", tone: "plain" }, { text: "return", tone: "k" }, { text: " order", tone: "plain" }],
    [{ text: "  })", tone: "plain" }],
    [{ text: "}", tone: "plain" }],
  ],
  requests: [
    { method: "POST", path: "/orders", status: "201 · 42ms" },
    { method: "GET", path: "/cards?set=sv", status: "200 · 18ms" },
    { method: "POST", path: "/agent/run", status: "200 · 610ms" },
    { method: "GET", path: "/health", status: "200 · 3ms" },
    { method: "PATCH", path: "/stock/88", status: "200 · 27ms" },
  ],
};
