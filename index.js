const express = require('express');
const cors = require('cors');
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
app.use(cors());

app.get('/price', async (req, res) => {
    await client.query('SELECT *\n' +
        'FROM items', (err, r) => {

        if (err) {
            res.status(404).send({
                message: err.detail
            });
        }
        else {
            res.json(r.rows);
        }
    });
});

app.get('/price/:iname', async (req, res) => {
    await client.query('SELECT *\n' +
        'FROM items\n' +
        `WHERE "ITEM Name"='${req.params.iname}'`, (err, r) => {

        if (err) {
            res.status(404).send({
                message: err.detail
            });
        }
        else {
            res.json(r.rows);
        }
    });
});

app.get('/maxprice', async (req, res) => {
    await client.query('SELECT "ITEM Name", MAX("COST")\n' +
        'FROM items\n' +
        'GROUP BY "ITEM Name"', (err, r) => {

        if (err) {
            res.status(404).send({
                message: err.detail
            });
        }
        else {
            res.json(r.rows);
        }
    });
});
app.get('/maxprice/:iname', async (req, res) => {
    await client.query('SELECT MAX("COST")\n' +
        'FROM items\n' +
        `WHERE "ITEM Name"='${req.params.iname}'`, (err, r) => {

        if (err) {
            res.status(404).send({
                message: err.detail
            });
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
                res.status(400).send({
                    message: err.detail
                });
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
app.patch('/edit/:iid', async (req, res) => {
    const item = req.body;

    if (item["ID"] && item["ITEM Name"] && item ["COST"]) {
        await client.query('UPDATE items\n' +
            `SET "ID"=${item["ID"]}, "ITEM Name"='${item["ITEM Name"]}', "COST"=${item["COST"]}\n` +
            `WHERE "ID"=${req.params.iid}`, (err, r) => {

            if (err) {
                console.log(err);
                res.status(400).send({
                    message: err.detail
                });
            }
            else {
                res.sendStatus(200);
            }
        })
    }
    else {
        res.sendStatus(400);
    }
});
// Delete item
app.delete('/edit/:iid', async (req, res) => {
    await client.query('DELETE FROM items\n' +
        `WHERE "ID"=${req.params.iid}`, (err, r) => {

        if (err) {
            console.log(err);
            res.status(400).send({
                message: err.detail
            });
        }
        else {
            res.sendStatus(200);
        }
    })
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));