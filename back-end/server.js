const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sport = require('../shared/classes/sport.js');
const app = express();
const PORT = 3000;

// API call settings
const wikidataEndPoint = 'https://query.wikidata.org/sparql';
const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Connection': 'keep-alive',
    'Cookie': 'GeoIP=FR:ARA:Villeurbanne:45.77:4.89:v4; WMF-Last-Access-Global=14-Dec-2024',
    'Host': 'query.wikidata.org',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15'
};

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
    const sports = ["basketball", "association footbal", "handball", "tennis", "American football"]; 
    let query = ""; 
    // sparql query
    if(sports.includes(sport)) {
        query = `SELECT ?label ?image ?inception ?authorityLabel ?countryOfOriginLabel ?icon ?unicode ?maxPlayers ?minPlayers (COUNT(?property) AS ?propertyCount) WHERE {
    
        # Find the entity by label
        ?entity rdfs:label "${sport}"@en.

        # Retrieve the label of the entity
        ?entity rdfs:label ?label. FILTER (LANG(?label) = "en").
        
        # Count all properties
        ?entity ?property ?value.

        # Retrieve the image
        OPTIONAL { ?entity wdt:P18 ?image. }
        
        # Retrieve the inception date
        OPTIONAL { ?entity wdt:P571 ?inception. }
        
        # Retrieve the authority or regulatory body
        OPTIONAL { ?entity wdt:P797 ?authority. }
        
        # Retrieve the country of origin
        OPTIONAL { ?entity wdt:P495 ?countryOfOrigin. }
        
        # Retrieve the icon or graphical representation
        OPTIONAL { ?entity wdt:P2910 ?icon. }
        
        # Retrieve the Unicode character or representation
        OPTIONAL { ?entity wdt:P487 ?unicode. }
        
        # Retrieve the maximum number of players
        OPTIONAL { ?entity wdt:P1873 ?maxPlayers. }
        
        # Retrieve the minimum number of players
        OPTIONAL { ?entity wdt:P1872 ?minPlayers. }
        
        # Fetch labels for related entities
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        GROUP BY ?entity ?label ?image ?inception ?authorityLabel 
                ?countryOfOriginLabel ?icon ?unicode ?maxPlayers ?minPlayers
        ORDER BY DESC(?propertyCount)
        LIMIT 1`;
    } else {
        res.status(400).send('Invalid sport');
        return;
    }
    // sending a request to the database
    const url = `${wikidataEndPoint}?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
        res.status(500).send('Failed to fetch data');
        console.log('Failed to fetch data');
        return;
    }

    const data = await response.json(); 
    let binding = data.results.bindings[0];

    let sportObject = new Sport(
        'label' in binding ? binding.label.value : null,
        'image' in binding ? binding.image.value : null,
        'inception' in binding ? binding.inception.value : null,
        'authorityLabel' in binding ? binding.authorityLabel.value : null,
        'countryOfOriginLabel' in binding ? binding.countryOfOriginLabel.value : null,
        'icon' in binding ? binding.icon.value : null,
        'unicode' in binding ? binding.unicode.value : null,
        'maxPlayers' in binding ? binding.maxPlayers.value : null,
        'minPlayers' in binding ? binding.minPlayers.value : null
    );

    res.send(sportObject);
});


// basketball
app.get('/searchBar', async (req, res) => {
    const filters = req.query.filters; // filters to apply to the search
    const input = req.query.input; // what the client entered in the search bar

    // sparql query to get the type of the input of the player
    let queryType = `SELECT ?type WHERE {
        ?input a ?type; 
            rdfs:label "${input}"@fr.
        }`;
});

// TODO list
// 1. create api calls that work for the carousel 
// 2. create api calls that work for the search bar
// 3. make the api call of the search bar work with the filters
// 4. make the search bar take typos