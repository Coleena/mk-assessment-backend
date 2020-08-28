const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.get('/prices', (req, res) => {
    res.send("Get request: /prices");
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