import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Ilove1130",
  port: 5432,
});
db.connect();

async function getAllItems() {
  let items = await db.query("SELECT * FROM listitems ORDER BY id ASC");
  items = items.rows;
  return items;
}

app.get("/", async (req, res) => {
  let items = await getAllItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

async function addItem(item){
  await db.query("INSERT INTO listitems (title) VALUES ($1);", [item]);
}

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  try{
    addItem(item);
  }
  catch(err) {
    console.error(err);
  }
  
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE listitems SET title = $1 WHERE id = $2;", [item, id]);
  }
  catch {
    console.log(err);
  }
  let items = await getAllItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM listitems WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
