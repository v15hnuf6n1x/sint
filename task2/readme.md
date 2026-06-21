# Task 2

## Build a User Management API using Node.js and Express that supports basic CRUD operations.

[ ] create a GET /user endpoint to rerive all user

[ ] Create a POST /users endpoint to add a new user.

[ ] Create a PUT /users/:id endpoint to update an existing user.

[ ] Create a DELETE /users/:id endpoint to delete a user.

[ ] Test all endpoints using Postman.



echo "=== POST /users ==="
curl -s -X POST http://localhost:3000/users -H 'Content-Type: application/json' -d '{"name":"Alice","email":"alice@example.com"}'
echo ""
echo "=== PUT /users/4 ==="
curl -s -X PUT http://localhost:3000/users/4 -H 'Content-Type: application/json' -d '{"name":"Alice Updated"}'
echo ""
echo "=== DELETE /users/4 ==="
curl -s -X DELETE http://localhost:3000/users/4
echo ""
echo "=== GET /users ==="
curl -s GET http://localhost:3000/users
echo ""



