const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const postgres = require("postgres");
const dotenv = require("dotenv");
dotenv.config();
// const sql = postgres("postgres://Local User@localhost:5432/todo_db");
const PORT = process.env.port || 3001;
const sql = postgres(process.env.DATABASE_URL);

app.get("/test", async (req, res) => {
  try {
    const response = await sql`SELECT * from todo_table ORDER BY start ASC`;
    res.send(response).status(200);
  } catch (error) {}
});

app.get("/test/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await sql`SELECT * from todo_table WHERE id = ${id}`;
    res.send(response).status(200);
  } catch (error) {}
});

app.post("/test", async (req, res) => {
  try {
    const { name, title, start, modified } = req.body;
    const response =
      await sql`INSERT INTO todo_table(name, title, start,modified)
    VALUES (${name},${title},${start},${modified}) RETURNING *`;
    res.send(response).status(200);
  } catch (error) {}
});

app.patch("/test/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, title, start, modified } = req.body;
    const response = await sql`UPDATE todo_table SET name = ${name},
    title = ${title},
    start = ${start},
    modified = ${modified}
    WHERE id = ${id} RETURNING *`;
    res.send(response).status(200);
  } catch (error) {}
});

app.delete("/test/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response =
      await sql`DELETE FROM todo_table WHERE id = ${id} RETURNING *`;
    res.send(response).status(200);
  } catch (error) {}
});

app.listen(3001, () => {
  console.log("listening on port 3001...");
});
