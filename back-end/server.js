const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const dbEndpoint = 'https://dbpedia.org/sparql';

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Rest apis
// Getting information about the sport
app.get('/sportInfo', async (req, res) => {
    // information about a sport was requested
    const sport = req.query.sport;

    // sparql query
    const query = `SELECT ?information ?teamSize ?region ?name  WHERE {
    ?sport rdf:type dbo:Sport;
    rdfs:label "${sport}"@en; 
    OPTIONAL { ?sport dbo:abstract ?information } . 
    dbo:abstract ?information ;
    dbo:teamSize ?teamSize ; 
    dbp:name ?name; 
    dbp:region ?region .

    FILTER (lang(?information) = "en") 
    FILTER (lang(?name) = "en")
    FILTER (lang(?region) = "en")
    }`;

    console.log('query', query);

    // sending a request to the database
    const url = `${dbEndpoint}?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {});

    if(!response.ok) {
        res.status(500).send('Failed to fetch data');
        console.log('Failed to fetch data');
        return;
    }

    const data = await response.json(); // serializing the response
    console.log('response', data);
    res.send(data);
});


// basketball
app.get('/basketball/teams', async (req, res) => {
    // getting the basketball teams
    const query =  'SELECT ?label WHERE { ?team a dbo:BasketballTeam ; rdfs:label ?label . FILTER (lang(?label) = "en") }';
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
    const labels = data.results.bindings.map(label => label.label.value);
    console.log('response', labels);
});

app.get('/basketball/players', (req, res) => {
    // send a request to the database to get the basketball players
});



