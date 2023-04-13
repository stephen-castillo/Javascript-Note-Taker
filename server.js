// Import Express.js
const express = require('express');

//Import UUID package for creating universally unique identifiers 
const {v4:uuidv4} = require('uuid');

//Import fs module to read and write from system files
const fs = require('fs');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;

// Static middleware pointing to the public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Route to the notes.html page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//Retrieve the notes from the db.json file
app.get('/api/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

//test uuid
//console.log(uuidv4());

//Save new note
app.post('/api/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync("db/db.json","utf8"));
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
    };
    data.push(newNote);
    fs.writeFileSync("db/db.json",JSON.stringify(data, null, 2));
    res.json(data);
});

//Delete Note
app.delete('/api/notes/:id', (req, res) =>{
    let data = JSON.parse(fs.readFileSync("db/db.json","utf8"));
    data = data.filter((note)=> { 
        return note.id !== req.params.id;
    });
    fs.writeFileSync("db/db.json",JSON.stringify(data));
    res.json("Note deleted.");

});

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);