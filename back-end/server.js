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
app.get('/barSearch', async (req, res) => {
    // information about a sport was requested
    const input = req.query.input; // what the client entered in the search bar
    const filters = req.query.filters; // filters to apply to the search

    // sparql query
    const query = `SELECT WHERE {
        ?input a ?type; 
        rdfs:label "${input}"@en .;
    }`

    console.log('query', query); // TODO remove

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

// carrousel search
app.get('/carouselSearch', async (req, res) => {
    // information about a sport was requested
    const sport = req.query.sport; // the sport that the client wants to get information about

    // sparql query
    if(sport === 'Basketball') {
        const query = `SELECT ?name ?placeToPlay ?teamSize ?firstPlayed ?associationName ?countries ?abstract WHERE {
        ?sport a dbo:Sport; 
        rdfs:label "Basketball" @en;
        rdfs:label ?name;
        dbo:abstract ?abstract;
        dbo:teamSize ?teamSize;
        dbp:type ?placeToPlay;
        dbp:first ?firstPlayed; 
        dbp:region ?countries;
        dbp:union ?union. 
        ?union dbo:abbreviation ?associationName. 
        FILTER (lang(?abstract) = "fr").
        FILTER (lang(?name) = "fr").
        }`
    } else if(sport === 'Football') {
        const query = `SELECT ?name ?abstract WHERE {
        ?sport a dbo:Sport; 
        rdfs:label "Football" @en;
        rdfs:label ?name;
        dbo:abstract ?abstract.
        
        FILTER (lang(?abstract) = "fr").
        FILTER (lang(?name) = "fr").
        }`;
    } else if(sport === 'Tennis') {
        const query = `SELECT ?name ?teamSize ?placeToPlay ?associationName ?countries ?abstract WHERE {
        ?sport a dbo:Sport; 
        rdfs:label "Tennis" @en;
        rdfs:label ?name;
        dbo:abstract ?abstract;
        dbo:team ?teamSize;
        dbp:type ?placeToPlay;
        dbp:region ?countries;
        dbp:union ?union. 
        ?union rdfs:label ?associationName. 
        FILTER (lang(?abstract) = "fr").
        FILTER (lang(?name) = "fr").
        FILTER(lang(?associationName) = "fr").
        }
        `
    }


    console.log('query', query); // TODO remove

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






// TODO list
// 1. create api calls that work for the carousel 
// 2. create api calls that work for the search bar
// 3. make the api call of the search bar work with the filters
// 4. make the search bar take typos