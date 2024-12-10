const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const dbEndpoint = 'https://dbpedia.org/sparql';

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// basketball
app.get('/basketball/teams', async (req, res) => {
    // getting the basketball teams
    const query =  'SELECT ?team WHERE { ?team a dbo:BasketballTeam }';
    const url = `${dbEndpoint}?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {
    });

    if(!response.ok) {
        res.status(500).send('Failed to fetch basketball teams');
        console.log('Failed to fetch basketball teams');
        return;
    }

    // parsing the json response
    const data = await response.json();
    const teams = data.results.bindings.map(team => team.team.value);
    console.log('response', response);
});

app.get('/basketball/players', (req, res) => {
    // send a request to the database to get the basketball players
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
