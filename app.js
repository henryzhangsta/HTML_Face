const express = require('express');
const multer = require('multer');
const upload = multer();

const app = express();
const port = 8080;

const staticHandler = (filename) => {
    return (req, res) => {
        res.sendFile(filename, {root: __dirname})
    }
}

app.use(express.urlencoded({extended: true}));
app.get('/', staticHandler('index.html'))
app.get('/index.html', staticHandler('index.html'))
app.get('/main.js', staticHandler('main.js'))
app.post('/facebox/check/', upload.none(), (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    console.log(req.body);

    const width = req.body.width;
    const height = req.body.height;

    res.json({
        x1: Math.floor(width * 0.25),
        x2: Math.floor(width * 0.75),
        y1: Math.floor(height * 0.25),
        y2: Math.floor(height * 0.75),
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
