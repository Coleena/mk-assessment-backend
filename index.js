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

        if (err) {
            res.sendStatus(404);
        }
        else {
            res.json(r.rows);
        }
    });
});
app.get('/prices/:iname', async (req, res) => {
    await client.query('SELECT MAX("COST")\n' +
        'FROM items\n' +
        `WHERE "ITEM Name"='${req.params.iname}'`, (err, r) => {

        if (err) {
            res.sendStatus(404);
        }
        else {
            res.json(r.rows[0]["max"]);
        }
    });
});

// New item
app.post('/edit', async (req, res) => {
    const item = req.body;

    if (item["ID"] && item["ITEM Name"] && item ["COST"]) {
        await client.query('INSERT INTO items(\n' +
            '"ID", "ITEM Name", "COST")\n' +
            `VALUES (${item["ID"]}, '${item["ITEM Name"]}', ${item["COST"]})`, (err, r) => {

            if (err) {
                console.log(err);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(201);
            }
        })
    }
    else {
        res.sendStatus(400);
    }
});
// Edit item
app.patch('/edit', async (req, res) => {
    const item = req.body;
    console.log(req.body);

    if (item["ID"] && item["ITEM Name"] && item ["COST"]) {
        await client.query('UPDATE items\n' +
            `SET "ITEM Name"='${item["ITEM Name"]}', "COST"=${item["COST"]}\n` +
            `WHERE "ID"=${item["ID"]}`, (err, r) => {

            if (err) {
                console.log(err);
                console.log("test2");
                res.sendStatus(400);
            }
            else {
                res.sendStatus(201);
            }
        })
    }
    else {
        console.log("test");
        res.sendStatus(400);
    }
});
app.delete('/edit', (req, res) => {

    res.send(`Delete request: /edit`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));