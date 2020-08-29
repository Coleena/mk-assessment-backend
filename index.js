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
    await client.query('SELECT "ITEM Name", MAX("COST")\n' +
        'FROM items\n' +
        'GROUP BY "ITEM Name"', (err, r) => {

        if (err) throw err;

        for (let row of r.rows) {
            console.log(JSON.stringify(row));
        }

        res.json(r.rows);
    });
});
app.get('/prices/:iname', async (req, res) => {
    await client.query('SELECT MAX("COST")\n' +
        'FROM items\n' +
        `WHERE "ITEM Name"='${req.params.iname}'`, (err, r) => {

        if (err) throw err;

        console.log(r.rows);

        res.send(r.rows[0]["max"]);
    });
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