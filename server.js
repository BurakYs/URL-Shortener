const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(__dirname + '/views/public'))
    .use(express.json())
    .set("views", path.join(__dirname, "/views"))

mongoose.connect("MONGODB CONNECTION LINK", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to MongoDB")).catch(e => { console.log(`An error occurred while connecting to MongoDB: ${e}`) })

const urlSchema = new mongoose.Schema({
    o: { type: String, required: true }, // Original URL
    s: { type: String, required: true, unique: true }, // Shortened URL
});

const Url = mongoose.model('URL', urlSchema);

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});
app.post('/api/shorten', async (req, res) => {
    const { o } = req.body;
    if (!new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i').test(o)) return false;

    const existingUrl = await Url.findOne({ o: o });
    if (existingUrl) {
        return res.json({ s: existingUrl.s });
    }
    let shortUrl = Math.random().toString(36).substring(2, 8);
    await Url.create({ o: o, s: shortUrl }).catch(e => {
        shortUrl = Math.random().toString(36).substring(2, 8);
    })
    res.json({ s: shortUrl });
});

app.get('/:s', async (req, res) => {
    const { s } = req.params;
    const url = await Url.findOne({ s: s });
    if (!url) {
        return res.sendStatus(404).json({ error: 'Not found' });
    }
    res.redirect(url.o);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
