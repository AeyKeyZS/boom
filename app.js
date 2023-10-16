const fs = require('fs');
const express = require("express");
const app = express();
app.use(express.urlencoded());
app.use(express.json());

ALL_FILES = []

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/get_files", (req, res) => {
    res.send(JSON.stringify(ALL_FILES));
});

app.get("/read", (req, res) => {
    let fileName = req.query.b;
    fileName = (ALL_FILES.includes(fileName + '.txt')) ? fileName : 'opr_shakti';
    fs.readFile('data/' + fileName + '.txt', 'utf-8', (err, data) => {
        if (err) throw err;
        res.send(data)
    })
});

app.post("/update", (req, res) => {
    if (req.method === 'POST' && req.url === '/update' && ALL_FILES.includes(req.body.file+'.txt')) {
        fs.writeFile('data/' + req.body.file + '.txt', req.body.content, (err) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error updating file');
            } else {
                res.statusCode = 200;
                res.end('Data updated');
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

app.listen(8000, () => {
    fs.readdir('data', (err, files) => {
        ALL_FILES = files.filter(item => item.endsWith('.txt'));
    });
    console.log('Server running on port 8000');
});