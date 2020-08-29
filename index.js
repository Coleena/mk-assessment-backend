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

app.get('/prices', async (req, res) => {
    let prices = [];

    await client.query('SELECT "ITEM Name", MAX("COST")\n' +
        'FROM items\n' +
        'GROUP BY "ITEM Name"', (err, res) => {

        if (err) throw err;

        prices = res.rows;
        console.log(prices);
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
    });

    console.log(prices);
    res.json(prices);
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