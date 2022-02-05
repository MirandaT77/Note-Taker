const express = require('express');
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require('path'); 
const db = require("./Develop/db/db.json");

const app = express();
// Middleware 
app.use(express.static('./Develop/public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function newNote(body) {
    console.log('console log body:', body);

    db.push(body);
    console.log("new db from push", db);
    fs.writeFileSync(
        path.join(__dirname, "./Develop/db/db.json"),
        JSON.stringify(db, null, 2)
    );
  
    return db;
}

function findById(id, db) {
    const result = db.filter((db) => db.id === id)[0];
    return result;
  }


  function filterByQuery(query, db) {
    let filteredResults = db;
    //See comments below for origin of queries
    if (query.noteTitle) {
      filteredResults = filteredResults.filter(
        (db) => (db.noteTitle = query.noteTitle)
      );
    }
    if (query.id) {
      filteredResults = filteredResults.filter((db) => (db.id = query.id));
    }
    return filteredResults;
  }

  app.get('/api/notes', (req, res) =>{
    let results = db;
    if (req. query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results)
});

  app.get("/api/notes/:id", (req, res) => {
    const result = findById(req.params.id, db);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
  


app.post("/api/notes", (req, res) =>{
    req.body.id = db.length.toString();
    const dataBase = [db];
    const note = newNote(req.body, dataBase);
    res.json(note);
    console.log("note in api route:", note)
})

app.delete('/api/notes/:id', (req, res) =>{
  const id = req.params.id;
  const data = (db);
  const indexId = data.findIndex(element => element["id"] === id)
  data.splice(indexId, 1);
  fs.writeFileSync(
    path.join(__dirname, "./Develop/db/db.json"),
    JSON.stringify(data)
);
res.redirect("back")

})


// creates routes 
app.get("/notes", (req, res) =>{
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
})

app.get("*", (req, res) =>{
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
})


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });