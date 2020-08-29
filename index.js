const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
client.connect();

app.use(express.json());

app.get('/prices', (req, res) => {
    res.send("Get request: /prices");

    client.query('SELECT * FROM items;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        client.end();
    });
});
app.get('/prices/:iname', (req, res) => {
    res.send(`Get request: /prices/${req.params.iname}`);
});

app.post('/edit', (req, res) => {
    const item = req.body;
    console.log(item);
    res.send(`Post request: /edit`);
});
app.patch('/edit', (req, res) => {

    res.send(`Patch request: /edit`);
});
app.delete('/edit', (req, res) => {

    res.send(`Delete request: /edit`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));