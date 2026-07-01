# task6 - E-Commerce Order Management API


Learn how to design scalable REST APIs with multiple resources, business logic, and order processing workflows.

## Description
Build an E-Commerce Order Management API that allows users to manage products, place orders, and track order status.

```bash
node server.js
```



## endpoints 

### products
- POST /products - add product. send {name, price, stock}
- GET /products - list em all
- GET /products/:id - get one
- PUT /products/:id - update
- DELETE /products/:id - bye bye

### customers
- POST /customers - add. send {name, email}
- GET /customers - list
- GET /customers/:id - one
- PUT /customers/:id - update
- DELETE /customers/:id - delete

### orders (this is where it gets fancy)
- POST /orders - place order. send {customerId, items: [{productId, quantity}]}
  it checks stock, deducts it, calculates total for u. magic.
- GET /orders - all orders
- GET /orders/:id - order details
- PATCH /orders/:id/status - update status. send {status}
  status goes pending -> processing -> shipped -> delivered
  cant go backwards, nice try



```bash
curl localhost:3000/products
curl -X POST localhost:3000/products -H "Content-Type: application/json" -d '{"name":"laptop","price":1000,"stock":5}'
```
