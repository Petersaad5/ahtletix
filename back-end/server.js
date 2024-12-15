const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sport = require('../shared/classes/sport.js');
const Athlete = require('../shared/classes/athlete.js');
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


app.get('/searchBar', async (req, res) => {
    let input = req.query.input; // the id of the entity that the client wants to search for
    let typeOfSearch = req.query.typeOfSearch; // type of the entity that the client wants to search for
    let filters = req.query.filters; // the filters that the client wants to apply to the search

    // checking for the type of the input of the client to know waht to search for
    let typeQuery = `SELECT ?typeLabel WHERE {
    ?entity rdfs:label "${input}"@en .

    # Get the type (class) of the entity
    ?entity wdt:P31 ?type.

    # Get the labels of the types
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    `; 

    // sending a request to the database
    const urlType = `${wikidataEndPoint}?query=${encodeURIComponent(typeQuery)}&format=json`;
    const responseType = await fetch(urlType, { method: 'GET', headers });
    if (!responseType.ok) {
        res.status(500).send('Failed to fetch data');
        console.log('Failed to fetch data');
        return;
    }
    
    const dataType = await responseType.json();
    // search all the bindings to see if it is a team or a human
    let bidings = dataType.results.bindings;
    for(let i in bidings) {
        if(bidings[i].typeLabel.value.includes('human')) {
            typeOfSearch = 'human';
            break
        } else if(bidings[i].typeLabel.value.includes('team') || bidings[i].typeLabel.value.includes('club')) {
            typeOfSearch = 'team';
            break;
        } else {
            res.status(400).send('Invalid input');
            return;
        }
    }

    let query = '';
    if(typeOfSearch === 'human') {
        query = `SELECT ?label ?image ?sportLabel ?genderLabel ?nationalityLabel ?height ?weight ?teamLabel ?signature 
        ?birthDate ?deathDate ?placeOfBirthLabel ?positionLabel ?teamsLabel ?awards ?socialMediaFollowers ?nicknameLabel
        WHERE {
    
        # Find the entity by label (assuming a person/entity search)
        ?entity rdfs:label "${input}"@en.

        # Retrieve the label of the entity
        ?entity rdfs:label ?label. FILTER (LANG(?label) = "en").
        
        # Retrieve the sport
        OPTIONAL { ?entity wdt:P641 ?sport. }
        
        # Retrieve the age (often birthdate related, P569)
        OPTIONAL { ?entity wdt:P569 ?birthDate. }
        
        # Retrieve gender (P21)
        OPTIONAL { ?entity wdt:P21 ?gender. }
        
        # Retrieve nationality (P27)
        OPTIONAL { ?entity wdt:P27 ?nationality. }
        
        # Retrieve height (P2048)
        OPTIONAL { ?entity wdt:P2048 ?height. }
        
        # Retrieve weight (P2067)
        OPTIONAL { ?entity wdt:P2067 ?weight. }
        
        # Retrieve the team (P54)
        OPTIONAL { ?entity wdt:P54 ?team. }
        
        # Retrieve image (P18)
        OPTIONAL { ?entity wdt:P18 ?image. }
        
        # Retrieve signature (P109)
        OPTIONAL { ?entity wdt:P109 ?signature. }
        
        # Retrieve the birth date (P569)
        OPTIONAL { ?entity wdt:P569 ?birthDate. }
        
        # Retrieve the death date (P570)
        OPTIONAL { ?entity wdt:P570 ?deathDate. }
        
        # Retrieve the place of birth (P19)
        OPTIONAL { ?entity wdt:P19 ?placeOfBirth. }
        
        # Retrieve the position (P413)
        OPTIONAL { ?entity wdt:P413 ?position. }
        
        # Retrieve teams (P54)
        OPTIONAL { ?entity wdt:P54 ?teams. }
        
        # Retrieve awards (P166)
        OPTIONAL { ?entity wdt:P166 ?awards. }
        
        # Retrieve social media followers (P8687)
        OPTIONAL { ?entity wdt:P8687 ?socialMediaFollowers. }
        
        # Retrieve nickname (P1449)
        OPTIONAL { ?entity wdt:P1449 ?nickname. }

        # Fetch labels for related entities
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 1
    `;
    } else if(typeOfSearch === 'team') {
        query = `SELECT ?label ?instanceOfLabel ?inception ?image ?logo ?nickname ?countryLabel ?sportLabel ?sponsorLabel 
        ?homeVenueLabel ?leagueLabel ?foundedByLabel ?headQuartersLabel ?officialWebsite ?kitSupplierLabel 
        ?socialMediaFollowers ?coachLabel
        WHERE {
        
        # Find the entity by label (assuming a label search)
        ?entity rdfs:label "${input}"@en.

        # Retrieve the label of the entity
        ?entity rdfs:label ?label. FILTER (LANG(?label) = "en").
        
        # Retrieve the instance of (P31)
        OPTIONAL { ?entity wdt:P31 ?instanceOf. }
        OPTIONAL { ?instanceOf rdfs:label ?instanceOfLabel. FILTER (LANG(?instanceOfLabel) = "en"). }
        
        # Retrieve the inception (P571)
        OPTIONAL { ?entity wdt:P571 ?inception. }
        
        # Retrieve image (P18)
        OPTIONAL { ?entity wdt:P18 ?image. }
        
        # Retrieve logo (P154)
        OPTIONAL { ?entity wdt:P154 ?logo. }
        
        # Retrieve nickname (P1449)
        OPTIONAL { ?entity wdt:P1449 ?nickname. }
        
        # Retrieve country (P17)
        OPTIONAL { ?entity wdt:P17 ?country. }
        OPTIONAL { ?country rdfs:label ?countryLabel. FILTER (LANG(?countryLabel) = "en"). }
        
        # Retrieve sport (P641)
        OPTIONAL { ?entity wdt:P641 ?sport. }
        OPTIONAL { ?sport rdfs:label ?sportLabel. FILTER (LANG(?sportLabel) = "en"). }
        
        # Retrieve sponsor (P859)
        OPTIONAL { ?entity wdt:P859 ?sponsor. }
        OPTIONAL { ?sponsor rdfs:label ?sponsorLabel. FILTER (LANG(?sponsorLabel) = "en"). }
        
        # Retrieve home venue (P115)
        OPTIONAL { ?entity wdt:P115 ?homeVenue. }
        OPTIONAL { ?homeVenue rdfs:label ?homeVenueLabel. FILTER (LANG(?homeVenueLabel) = "en"). }
        
        # Retrieve league (P118)
        OPTIONAL { ?entity wdt:P118 ?league. }
        OPTIONAL { ?league rdfs:label ?leagueLabel. FILTER (LANG(?leagueLabel) = "en"). }
        
        # Retrieve founder (P112)
        OPTIONAL { ?entity wdt:P112 ?foundedBy. }
        OPTIONAL { ?foundedBy rdfs:label ?foundedByLabel. FILTER (LANG(?foundedByLabel) = "en"). }
        
        # Retrieve headquarters (P159)
        OPTIONAL { ?entity wdt:P159 ?headQuarters. }
        OPTIONAL { ?headQuarters rdfs:label ?headQuartersLabel. FILTER (LANG(?headQuartersLabel) = "en"). }
        
        # Retrieve official website (P856)
        OPTIONAL { ?entity wdt:P856 ?officialWebsite. }
        
        # Retrieve kit supplier (P5995)
        OPTIONAL { ?entity wdt:P5995 ?kitSupplier. }
        OPTIONAL { ?kitSupplier rdfs:label ?kitSupplierLabel. FILTER (LANG(?kitSupplierLabel) = "en"). }
        
        # Retrieve social media followers (P8687)
        OPTIONAL { ?entity wdt:P8687 ?socialMediaFollowers. }
        
        # Retrieve coach (P286)
        OPTIONAL { ?entity wdt:P286 ?coach. }
        OPTIONAL { ?coach rdfs:label ?coachLabel. FILTER (LANG(?coachLabel) = "en"). }

        # Fetch labels for related entities
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        LIMIT 1`; 

        // TODO this query is not working
    }

    // sending a request to the database
    const urlObject = `${wikidataEndPoint}?query=${encodeURIComponent(query)}&format=json`;
    console.log(urlObject);
    const responseObject = await fetch(urlObject, { method: 'GET', headers });
    if (!responseObject.ok) {
        res.status(500).send('Failed to fetch data');
        console.log('Failed to fetch data');
        return;
    }

    const dataObjet = await responseObject.json(); 
    let binding = dataObjet.results.bindings[0];
    let object = null; 
    if(typeOfSearch === 'human') {
        object = new Athlete(
            'label' in binding ? binding.label.value : null,
            'sportLabel' in binding ? binding.sportLabel.value : null,
            'genderLabel' in binding ? binding.genderLabel.value : null,
            'nationalityLabel' in binding ? binding.nationalityLabel.value : null,
            'height' in binding ? binding.height.value : null,
            'weight' in binding ? binding.weight.value : null,
            'teamLabel' in binding ? binding.teamLabel.value : null,
            'image' in binding ? binding.image.value : null,
            'signature' in binding ? binding.signature.value : null,
            'birthDate' in binding ? binding.birthDate.value : null,
            'deathDate' in binding ? binding.deathDate.value : null,
            'placeOfBirthLabel' in binding ? binding.placeOfBirthLabel.value : null,
            'positionLabel' in binding ? binding.positionLabel.value : null,
            'teamsLabel' in binding ? binding.teamsLabel.value : null,
            'awards' in binding ? binding.awards.value : null,
            'socialMediaFollowers' in binding ? binding.socialMediaFollowers.value : null,
            'nicknameLabel' in binding ? binding.nicknameLabel.value : null
        );
    } else if(typeOfSearch === 'team') {
        object = new Team(
            'label' in binding ? binding.label.value : null,
            'instanceOfLabel' in binding ? binding.instanceOfLabel.value : null,
            'inception' in binding ? binding.inception.value : null,
            'image' in binding ? binding.image.value : null,
            'logo' in binding ? binding.logo.value : null,
            'nickname' in binding ? binding.nickname.value : null,
            'countryLabel' in binding ? binding.countryLabel.value : null,
            'sportLabel' in binding ? binding.sportLabel.value : null,
            'sponsorLabel' in binding ? binding.sponsorLabel.value : null,
            'homeVenueLabel' in binding ? binding.homeVenueLabel.value : null,
            'leagueLabel' in binding ? binding.leagueLabel.value : null,
            'foundedByLabel' in binding ? binding.foundedByLabel.value : null,
            'headQuartersLabel' in binding ? binding.headQuartersLabel.value : null,
            'officialWebsite' in binding ? binding.officialWebsite.value : null,
            'kitSupplierLabel' in binding ? binding.kitSupplierLabel.value : null,
            'socialMediaFollowers' in binding ? binding.socialMediaFollowers.value : null,
            'coachLabel' in binding ? binding.coachLabel.value : null
        );
    }
    console.log(object);
    res.send({typeOfSearch, object});
});

app.get('/autoCompletion', async (req, res) => {
    let input = req.query.input; // the input that the client wants to search for
    let query = `SELECT DISTINCT ?itemLabel ?item (COUNT(?claim) AS ?claimCount) ?matchType WHERE {
    # Perform the search using the mwapi service
    SERVICE wikibase:mwapi {
        bd:serviceParam wikibase:endpoint "www.wikidata.org";
                        wikibase:api "EntitySearch";
                        mwapi:search "${input}";
                        mwapi:language "fr".
        ?item wikibase:apiOutputItem mwapi:item.
    }

    OPTIONAL { # Athlete (P1447)
        ?item wdt:P1447 ?athleteId. 
    }  
    OPTIONAL { # Team's sport (P641)
        ?item wdt:P641 ?sport; 
              wdt:P31 ?type.
        ?type rdfs:label ?typeLabel.
        FILTER(LANG(?typeLabel) = "en").
        FILTER regex(?typeLabel, "team|club", "i").   
    }

    # Count the claims to rank by the number of claims
    ?item ?claim ?value.
    FILTER(BOUND(?athleteId) || BOUND(?sport))  # At least one must be true

    # BIND match type (athlete or team)
    BIND(IF(BOUND(?athleteId), "athlete", IF(BOUND(?sport), "team", "unknown")) AS ?matchType)

    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
    }
    GROUP BY ?item ?itemLabel ?matchType
    ORDER BY DESC(?claimCount)  # Order by the number of claims (most popular based on claims)
    LIMIT 10
`;

    // sending a request to the database
    const url = `${wikidataEndPoint}?query=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
        res.status(500).send('Failed to fetch data');
        console.log('Failed to fetch data');
        return;
    }

    const data = await response.json(); 
    let bindings = data.results.bindings;
    let retArray = [];
    for(let i in bindings) {
        let json = {id: bindings[i].item.value, label: bindings[i].itemLabel.value, matchType: bindings[i].matchType.value};
        retArray.push(json);
    }

    res.send(retArray);
}); 

// TODO list
// 2. create api calls that work for the search bar
// 3. make the api call of the search bar work with the filters
// 4. autocompletion


// TODO check if the input is neither a sport nor a human