const express = require("express");

const app = express();
app.use(express.json());

// ── In-memory data ──────────────────────────────────────────
let products = [];
let customers = [];
let orders = [];
let nextProductId = 1;
let nextCustomerId = 1;
let nextOrderId = 1;

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered"];

// ── Helpers ──────────────────────────────────────────────────
function findOr404(arr, id, label, res) {
  const item = arr.find((i) => i.id === id);
  if (!item) {
    res.status(404).json({ error: `${label} not found` });
    return null;
  }
  return item;
}

function validateId(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return null;
  }
  return id;
}

// ── Product CRUD ────────────────────────────────────────────
app.post("/products", (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ error: "name, price, and stock are required" });
  }
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ error: "price must be a non-negative number" });
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: "stock must be a non-negative integer" });
  }
  const product = { id: nextProductId++, name, price, stock };
  products.push(product);
  res.status(201).json(product);
});

app.get("/products", (req, res) => res.json(products));

app.get("/products/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const product = findOr404(products, id, "Product", res);
  if (!product) return;
  res.json(product);
});

app.put("/products/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const product = findOr404(products, id, "Product", res);
  if (!product) return;

  const { name, price, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) {
    if (typeof price !== "number" || price < 0)
      return res.status(400).json({ error: "price must be a non-negative number" });
    product.price = price;
  }
  if (stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0)
      return res.status(400).json({ error: "stock must be a non-negative integer" });
    product.stock = stock;
  }
  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(idx, 1);
  res.status(204).send();
});

// ── Customer CRUD ───────────────────────────────────────────
app.post("/customers", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const customer = { id: nextCustomerId++, name, email };
  customers.push(customer);
  res.status(201).json(customer);
});

app.get("/customers", (req, res) => res.json(customers));

app.get("/customers/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const customer = findOr404(customers, id, "Customer", res);
  if (!customer) return;
  res.json(customer);
});

app.put("/customers/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const customer = findOr404(customers, id, "Customer", res);
  if (!customer) return;
  const { name, email } = req.body;
  if (name !== undefined) customer.name = name;
  if (email !== undefined) customer.email = email;
  res.json(customer);
});

app.delete("/customers/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Customer not found" });
  customers.splice(idx, 1);
  res.status(204).send();
});

// ── Orders ──────────────────────────────────────────────────
app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;

  if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "customerId and items (non-empty array) are required" });
  }

  const customer = findOr404(customers, customerId, "Customer", res);
  if (!customer) return;

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    if (!item.productId || item.quantity == null) {
      return res.status(400).json({ error: "Each item must have productId and quantity" });
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
    }

    product.stock -= item.quantity;
    const subtotal = product.price * item.quantity;
    total += subtotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal,
    });
  }

  const order = {
    id: nextOrderId++,
    customerId,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get("/orders", (req, res) => res.json(orders));

app.get("/orders/:id", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const order = findOr404(orders, id, "Order", res);
  if (!order) return;
  res.json(order);
});

app.patch("/orders/:id/status", (req, res) => {
  const id = validateId(req, res);
  if (id === null) return;
  const order = findOr404(orders, id, "Order", res);
  if (!order) return;

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Valid values: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const currentIdx = VALID_STATUSES.indexOf(order.status);
  const newIdx = VALID_STATUSES.indexOf(status);
  if (newIdx <= currentIdx) {
    return res.status(400).json({
      error: `Status can only move forward. Current: ${order.status}`,
    });
  }

  order.status = status;
  res.json(order);
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Order Management API running on port ${PORT}`);
});
