const express = require("express");

const app = express();
const PORT = 3000;

let users = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" }
];

app.delete("/user/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users = users.filter(u => u.id !== id);
  res.json({
    message: "User deleted successfully",
    deletedUser: user
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
