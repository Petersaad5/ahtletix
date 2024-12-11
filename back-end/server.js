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
    const query =''; // TODO

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
    // array of the sports that the client can search for
    const sports = ["Basketball", "Football", "Handball", "Tennis", "American football"]; 
    let query = ""; 
    // sparql query
    if(sports.includes(sport)) {
        query = `SELECT ?name ?nbPlayers ?placeToPlay ?information ?image ?firstPlayed ?associationName ?countries WHERE {
        ?sport a dbo:Sport; 
                rdfs:label "${sport}"@en;
                rdfs:label ?name;
                dbo:abstract ?information.
                
        OPTIONAL { ?sport dbo:teamSize ?nbPlayers. }
        OPTIONAL { ?sport dbp:type ?placeToPlay. }
        OPTIONAL { ?sport dbp:team ?nbPlayers. }
        OPTIONAL { ?sport dbo:thumbnail ?image. }
        OPTIONAL { 
            ?sport dbp:first ?firstPlayed. 
            FILTER (DATATYPE(?firstPlayed) = xsd:date). 
        }
        OPTIONAL { ?sport dbp:region ?countries. }
        OPTIONAL { 
            ?sport dbp:union ?union. 
            ?union rdfs:label ?associationName. 
            FILTER(lang(?associationName) = "fr").
        }

        FILTER (lang(?information) = "fr").
        FILTER (lang(?name) = "fr").
        }`;
    } else {
        res.status(400).send('Invalid sport');
        return;
    }
    // sending a request to the database
    const url = `${dbEndpoint}?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {});

    if(!response.ok) {
        res.status(500).send('Failed to fetch data');
        console.log('Failed to fetch data');
        return;
    }

    let data = await response.json(); 
    const sportInfo = data.results.bindings.map(binding => ({
        name: binding.name ? binding.name.value : null,
        nbPlayers: binding.nbPlayers ? binding.nbPlayers.value : null,
        placeToPlay: binding.placeToPlay ? binding.placeToPlay.value : null,
        information: binding.information ? binding.information.value : null,
        image: binding.image ? binding.image.value : null,
        firstPlayed: binding.firstPlayed ? binding.firstPlayed.value : null,
        associationName: binding.associationName ? binding.associationName.value : null,
        countries: binding.countries ? binding.countries.value : null
    }));
    
    res.send(sportInfo);
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