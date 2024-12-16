const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sport = require("../shared/classes/sport.js");
const Athlete = require("../shared/classes/athlete.js");
const Team = require("../shared/classes/team.js");
const app = express();
const PORT = 3000;

// API call settings
const wikidataEndPoint = "https://query.wikidata.org/sparql";
const headers = {
  "User-Agent": "Mozilla/5.0 (compatible; GenericBrowser/1.0;",
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
app.get("/carouselSearch", async (req, res) => {
  // information about a sport was requested
  const sport = req.query.sport; // the sport that the client wants to get information about
  // array of the sports that the client can search for
  const sports = [
    "basketball",
    "association football",
    "handball",
    "tennis",
    "American football",
    "boxing",
    "volleyball",
  ];
  let query = "";
  // sparql query
  if (sports.includes(sport)) {
    query = `SELECT ?label ?image ?inception ?authorityLabel ?countryOfOriginLabel ?icon ?unicode ?maxPlayers ?minPlayers (COUNT(?property) AS ?propertyCount) WHERE {
    
        # Find the entity by label
        ?entity rdfs:label "${sport}"@en.

        # Retrieve the label of the entity
        ?entity rdfs:label ?label. FILTER (LANG(?label) = "fr").
        
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
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
        }
        GROUP BY ?entity ?label ?image ?inception ?authorityLabel 
                ?countryOfOriginLabel ?icon ?unicode ?maxPlayers ?minPlayers
        ORDER BY DESC(?propertyCount)
        LIMIT 1`;
  } else {
    res.status(400).send("Invalid sport");
    return;
  }
  // sending a request to the database
  const url = `${wikidataEndPoint}?query=${encodeURIComponent(
    query
  )}&format=json`;
  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    res.status(500).send("Failed to fetch data");
    console.log("Failed to fetch data");
    return;
  }

  const data = await response.json();
  let binding = data.results.bindings[0];

  let sportObject = new Sport(
    "label" in binding ? binding.label.value : null,
    "image" in binding ? binding.image.value : null,
    "inception" in binding ? binding.inception.value : null,
    "authorityLabel" in binding ? binding.authorityLabel.value : null,
    "countryOfOriginLabel" in binding
      ? binding.countryOfOriginLabel.value
      : null,
    "icon" in binding ? binding.icon.value : null,
    "unicode" in binding ? binding.unicode.value : null,
    "maxPlayers" in binding ? binding.maxPlayers.value : null,
    "minPlayers" in binding ? binding.minPlayers.value : null
  );

  res.send(sportObject);
});

app.get("/searchBar", async (req, res) => {
  let input = req.query.input; // the id of the entity that the client wants to search for
  let typeOfSearch = req.query.typeOfSearch; // type of the entity that the client wants to search for

  let query = "";
  if (typeOfSearch === "athlete") {
    query = `SELECT ?label ?image ?sportLabel ?genderLabel ?nationalityLabel ?height ?weight ?signature 
        ?birthDate ?deathDate ?placeOfBirthLabel ?positionLabel ?teams ?teamsLabel ?awardsLabel ?socialMediaFollowers ?nicknameLabel
        WHERE {
    
        # Retrieve the label of the entity
        ${input} rdfs:label ?label. FILTER (LANG(?label) = "fr").
        
        # Retrieve the sport
        OPTIONAL { ${input} wdt:P641 ?sport. }
        
        # Retrieve the age (often birthdate related, P569)
        OPTIONAL { ${input} wdt:P569 ?birthDate. }
        
        # Retrieve gender (P21)
        OPTIONAL { ${input} wdt:P21 ?gender. }
        
        # Retrieve nationality (P27)
        OPTIONAL { ${input} wdt:P27 ?nationality. }
        
        # Retrieve height (P2048)
        OPTIONAL { ${input} wdt:P2048 ?height. }
        
        # Retrieve weight (P2067)
        OPTIONAL { ${input} wdt:P2067 ?weight. }
        
        # Retrieve image (P18)
        OPTIONAL { ${input} wdt:P18 ?image. }
        
        # Retrieve signature (P109)
        OPTIONAL { ${input} wdt:P109 ?signature. }
        
        # Retrieve the birth date (P569)
        OPTIONAL { ${input} wdt:P569 ?birthDate. }
        
        # Retrieve the death date (P570)
        OPTIONAL { ${input} wdt:P570 ?deathDate. }
        
        # Retrieve the place of birth (P19)
        OPTIONAL { ${input} wdt:P19 ?placeOfBirth. }
        
        # Retrieve the position (P413)
        OPTIONAL { ${input} wdt:P413 ?position. }
        
        # Retrieve teams (P54)
        OPTIONAL { ${input} wdt:P54 ?teams. }
        
        # Retrieve awards (P166)
        OPTIONAL { ${input} wdt:P166 ?awards. }
        
        # Retrieve social media followers (P8687)
        OPTIONAL { ${input} wdt:P8687 ?socialMediaFollowers. }
        
        # Retrieve nickname (P1449)
        OPTIONAL { ${input} wdt:P1449 ?nickname. }

        # Fetch labels for related entities
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
    }
    `;
  } else if (typeOfSearch === "team") {
    query = `SELECT ?label ?image ?logo ?nicknameLabel ?countryLabel ?sportLabel ?sponsorLabel 
        ?homeVenueLabel ?leagueLabel ?foundedByLabel ?headQuartersLabel 
        ?officialWebsite ?kitSupplierLabel ?socialMediaFollowers ?coachLabel ?inception
        WHERE {
    
        # Retrieve the label of the entity
        ${input} rdfs:label ?label. FILTER (LANG(?label) = "fr").
        
        # Retrieve the image (P18)
        OPTIONAL { ${input} wdt:P18 ?image. }
        
        # Retrieve the logo (P154)
        OPTIONAL { ${input} wdt:P154 ?logo. }
        
        # Retrieve nickname (P1449)
        OPTIONAL { ${input} wdt:P1449 ?nickname. }
        
        # Retrieve the country (P17)
        OPTIONAL { ${input} wdt:P17 ?country. }
        
        # Retrieve the sport (P641)
        OPTIONAL { ${input} wdt:P641 ?sport. }
        
        # Retrieve the sponsor (P859)
        OPTIONAL { ${input} wdt:P859 ?sponsor. }
        
        # Retrieve the home venue (P115)
        OPTIONAL { ${input} wdt:P115 ?homeVenue. }
        
        # Retrieve the league (P118)
        OPTIONAL { ${input} wdt:P118 ?league. }
        
        # Retrieve the founder(s) (P112)
        OPTIONAL { ${input} wdt:P112 ?foundedBy. }
        
        # Retrieve headquarters (P159)
        OPTIONAL { ${input} wdt:P159 ?headQuarters. }
        
        # Retrieve the official website (P856)
        OPTIONAL { ${input} wdt:P856 ?officialWebsite. }
        
        # Retrieve the kit supplier (P5995)
        OPTIONAL { ${input} wdt:P5995 ?kitSupplier. }
        
        # Retrieve social media followers (P8687)
        OPTIONAL { ${input} wdt:P8687 ?socialMediaFollowers. }
        
        # Retrieve the coach (P286)
        OPTIONAL { ${input} wdt:P286 ?coach. }
        
        # Retrieve the inception date (P571)
        OPTIONAL { ${input} wdt:P571 ?inception. }

        # Fetch labels for related entities
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
        }
        `;
  } else {
    res.status(400).send("Invalid type of search");
    return;
  }

  // sending a request to the database
  const urlObject = `${wikidataEndPoint}?query=${encodeURIComponent(
    query
  )}&format=json`;
  const responseObject = await fetch(urlObject, { method: "GET", headers });
  if (!responseObject.ok) {
    res.status(500).send("Failed to fetch data");
    console.log("Failed to fetch data");
    return;
  }

  const dataObjet = await responseObject.json();
  let bindings = dataObjet.results.bindings;
  let object = null;
  if (typeOfSearch === "athlete") {
    let teamsID = [];
    let teamsNames = [];
    let awards = [];
    let socialMediaFollowers = [];
    let position = [];
    for (let i in bindings) {
      if ("teamsLabel" in bindings[i] && "teams" in bindings[i]) {
        teamsNames.push(bindings[i].teamsLabel.value);
        teamsID.push("wd:" + bindings[i].teams.value.split("/").pop());
      }
      if ("awardsLabel" in bindings[i])
        awards.push(bindings[i].awardsLabel.value);

      if ("socialMediaFollowers" in bindings[i])
        socialMediaFollowers.push(bindings[i].socialMediaFollowers.value);

      if ("positionLabel" in bindings[i])
        position.push(bindings[i].positionLabel.value);
    }
    teamsID = [...new Set(teamsID)];
    teamsNames = [...new Set(teamsNames)];
    // merge the sets into one array with json obejcts
    let teams = [];
    for (let i in teamsID) {
      let json = { teamId: teamsID[i], teamName: teamsNames[i] };
      teams.push(json);
    }
    awards = [...new Set(awards)];
    socialMediaFollowers = [...new Set(socialMediaFollowers)];
    position = [...new Set(position)];
    object = new Athlete(
      "label" in bindings[0] ? bindings[0].label.value : null,
      "sportLabel" in bindings[0] ? bindings[0].sportLabel.value : null,
      "genderLabel" in bindings[0] ? bindings[0].genderLabel.value : null,
      "nationalityLabel" in bindings[0]
        ? bindings[0].nationalityLabel.value
        : null,
      "height" in bindings[0] ? bindings[0].height.value : null,
      "weight" in bindings[0] ? bindings[0].weight.value : null,
      "image" in bindings[0] ? bindings[0].image.value : null,
      "signature" in bindings[0] ? bindings[0].signature.value : null,
      "birthDate" in bindings[0] ? bindings[0].birthDate.value : null,
      "deathDate" in bindings[0] ? bindings[0].deathDate.value : null,
      "placeOfBirthLabel" in bindings[0]
        ? bindings[0].placeOfBirthLabel.value
        : null,
      position,
      teams,
      awards,
      socialMediaFollowers,
      "nicknameLabel" in bindings[0] ? bindings[0].nicknameLabel.value : null
    );
  } else if (typeOfSearch === "team") {
    let sponsor = [];
    let socialMediaFollowers = [];
    for (let i in bindings) {
      if ("sponsorLabel" in bindings[i])
        sponsor.push(bindings[i].sponsorLabel.value);
      if ("socialMediaFollowers" in bindings[i])
        socialMediaFollowers.push(bindings[i].socialMediaFollowers.value);
    }
    sponsor = [...new Set(sponsor)];
    socialMediaFollowers = [...new Set(socialMediaFollowers)];
    object = new Team(
      "instanceOfLabel" in bindings[0]
        ? bindings[0].instanceOfLabel.value
        : null,
      "inception" in bindings[0] ? bindings[0].inception.value : null,
      "label" in bindings[0] ? bindings[0].label.value : null,
      "image" in bindings[0] ? bindings[0].image.value : null,
      "logo" in bindings[0] ? bindings[0].logo.value : null,
      "nickname" in bindings[0] ? bindings[0].nickname.value : null,
      "countryLabel" in bindings[0] ? bindings[0].countryLabel.value : null,
      "sportLabel" in bindings[0] ? bindings[0].sportLabel.value : null,
      sponsor,
      "homeVenueLabel" in bindings[0] ? bindings[0].homeVenueLabel.value : null,
      "leagueLabel" in bindings[0] ? bindings[0].leagueLabel.value : null,
      "foundedByLabel" in bindings[0] ? bindings[0].foundedByLabel.value : null,
      "headQuartersLabel" in bindings[0]
        ? bindings[0].headQuartersLabel.value
        : null,
      "officialWebsite" in bindings[0]
        ? bindings[0].officialWebsite.value
        : null,
      "kitSupplierLabel" in bindings[0]
        ? bindings[0].kitSupplierLabel.value
        : null,
      socialMediaFollowers,
      "coachLabel" in bindings[0] ? bindings[0].coachLabel.value : null
    );
  }
  res.send({ typeOfSearch, object });
});

app.get("/autoCompletion", async (req, res) => {
  const input = req.query.input || ""; // Keyword for search (e.g., "Michael")
  const sports = req.query.sports?.split(",").map((s) => s.trim()) || [];
  const countries = req.query.countries?.split(",").map((c) => c.trim()) || [];

  // Define mappings for sports and countries
  const sportMapping = {
    Aviron: "Q350525", // Rowing
    Athlétisme: "Q542", // Athletics
    Badminton: "Q5372", // Badminton
    Baseball: "Q5369", // Baseball
    "Basket-ball": "Q5372", // Basketball
    Biathlon: "Q222311", // Biathlon
    Boxe: "Q220055", // Boxing
    "Canoë-kayak": "Q344960", // Canoeing
    "Canoë-polo": "Q151323", // Canoe polo
    "Course à pied": "Q11439", // Running
    Cyclisme: "Q11436", // Cycling
    Escrime: "Q5375", // Fencing
    Equitation: "Q165506", // Equestrianism
    Football: "Q2736", // Football (soccer)
    Golf: "Q5378", // Golf
    Gymnastique: "Q172351", // Gymnastics
    Handball: "Q5371", // Handball
    Haltérophilie: "Q195978", // Weightlifting
    "Hockey sur gazon": "Q5370", // Field hockey
    "Hockey sur glace": "Q5377", // Ice hockey
    Judo: "Q5374", // Judo
    Karaté: "Q9168", // Karate
    Lutte: "Q11015", // Wrestling
    Natation: "Q31920", // Swimming
    "Patinage artistique": "Q31967", // Figure skating
    "Patinage de vitesse": "Q31969", // Speed skating
    "Pêche sportive": "Q1290940", // Sport fishing
    Pétanque: "Q174316", // Pétanque
    Plongée: "Q3463804", // Diving
    Rugby: "Q5379", // Rugby
    "Ski alpin": "Q31925", // Alpine skiing
    "Ski de fond": "Q31926", // Cross-country skiing
    Snowboard: "Q847", // Snowboarding
    Softball: "Q5373", // Softball
    Squash: "Q8476", // Squash
    Surf: "Q159030", // Surfing
    Taekwondo: "Q5376", // Taekwondo
    Tennis: "Q8471", // Tennis
    "Tennis de table": "Q8478", // Table tennis
    "Tir à l'arc": "Q1054518", // Archery
    "Tir sportif": "Q159653", // Shooting sports
    Triathlon: "Q8461", // Triathlon
    Voile: "Q112663", // Sailing
    "Volley-ball": "Q5372", // Volleyball
    "Water-polo": "Q8477", // Water polo
    Windsurf: "Q112663", // Windsurfing (shared with sailing)
  };

  const countryMapping = {
    Afghanistan: "Q889",
    "Afrique du Sud": "Q258",
    Albanie: "Q222",
    Algérie: "Q262",
    Allemagne: "Q183",
    Andorre: "Q228",
    Angola: "Q916",
    "Antigua-et-Barbuda": "Q781",
    "Arabie Saoudite": "Q851",
    Argentine: "Q414",
    Arménie: "Q399",
    Australie: "Q408",
    Autriche: "Q40",
    Azerbaïdjan: "Q227",
    Bahamas: "Q778",
    Bahreïn: "Q398",
    Bangladesh: "Q902",
    Barbade: "Q244",
    Belgique: "Q31",
    Belize: "Q242",
    Bénin: "Q962",
    Bhoutan: "Q917",
    Biélorussie: "Q184",
    Birmanie: "Q836",
    Bolivie: "Q750",
    "Bosnie-Herzégovine": "Q225",
    Botswana: "Q963",
    Brésil: "Q155",
    Brunei: "Q921",
    Bulgarie: "Q219",
    "Burkina Faso": "Q965",
    Burundi: "Q967",
    Cambodge: "Q424",
    Cameroun: "Q1009",
    Canada: "Q16",
    "Cap-Vert": "Q1011",
    Chili: "Q298",
    Chine: "Q148",
    Chypre: "Q229",
    Colombie: "Q739",
    Comores: "Q970",
    "Congo-Brazzaville": "Q971",
    "Congo-Kinshasa": "Q974",
    "Corée du Nord": "Q423",
    "Corée du Sud": "Q884",
    "Costa Rica": "Q800",
    "Côte d’Ivoire": "Q1008",
    Croatie: "Q224",
    Cuba: "Q241",
    Danemark: "Q35",
    Djibouti: "Q977",
    Dominique: "Q784",
    Égypte: "Q79",
    "Émirats Arabes Unis": "Q878",
    Équateur: "Q736",
    Érythrée: "Q986",
    Espagne: "Q29",
    Eswatini: "Q1050",
    Estonie: "Q191",
    "États-Unis": "Q30",
    Éthiopie: "Q115",
    Fidji: "Q712",
    Finlande: "Q33",
    France: "Q142",
    Gabon: "Q1000",
    Gambie: "Q1005",
    Géorgie: "Q230",
    Ghana: "Q117",
    Grèce: "Q41",
    Grenade: "Q769",
    Guatemala: "Q774",
    Guinée: "Q1006",
    "Guinée-Bissau": "Q1007",
    "Guinée équatoriale": "Q983",
    Guyana: "Q734",
    Haïti: "Q790",
    Honduras: "Q783",
    Hongrie: "Q28",
    "Îles Marshall": "Q709",
    "Îles Salomon": "Q685",
    Inde: "Q668",
    Indonésie: "Q252",
    Irak: "Q796",
    Iran: "Q794",
    Irlande: "Q27",
    Islande: "Q189",
    Israël: "Q801",
    Italie: "Q38",
    Jamaïque: "Q766",
    Japon: "Q17",
    Jordanie: "Q810",
    Kazakhstan: "Q232",
    Kenya: "Q114",
    Kirghizistan: "Q813",
    Kiribati: "Q710",
    Kosovo: "Q1246",
    Koweït: "Q817",
    Laos: "Q819",
    Lesotho: "Q1013",
    Lettonie: "Q211",
    Liban: "Q822",
    Libéria: "Q1014",
    Libye: "Q1016",
    Liechtenstein: "Q347",
    Lituanie: "Q37",
    Luxembourg: "Q32",
    "Macédoine du Nord": "Q221",
    Madagascar: "Q1019",
    Malaisie: "Q833",
    Malawi: "Q1020",
    Maldives: "Q826",
    Mali: "Q912",
    Malte: "Q233",
    Maroc: "Q1028",
    Maurice: "Q1027",
    Mauritanie: "Q1025",
    Mexique: "Q96",
    Micronésie: "Q702",
    Moldavie: "Q217",
    Monaco: "Q235",
    Mongolie: "Q711",
    Monténégro: "Q236",
    Mozambique: "Q1029",
    Namibie: "Q1030",
    Nauru: "Q697",
    Népal: "Q837",
    Nicaragua: "Q811",
    Niger: "Q1032",
    Nigéria: "Q1033",
    Norvège: "Q20",
    "Nouvelle-Zélande": "Q664",
    Oman: "Q842",
    Ouganda: "Q1036",
    Ouzbékistan: "Q265",
    Pakistan: "Q843",
    Palaos: "Q695",
    Panama: "Q804",
    "Papouasie-Nouvelle-Guinée": "Q691",
    Paraguay: "Q733",
    "Pays-Bas": "Q55",
    Pérou: "Q419",
    Philippines: "Q928",
    Pologne: "Q36",
    Portugal: "Q45",
    Qatar: "Q846",
    "République Centrafricaine": "Q929",
    "République Dominicaine": "Q786",
    "République Tchèque": "Q213",
    Roumanie: "Q218",
    "Royaume-Uni": "Q145",
    Russie: "Q159",
    Rwanda: "Q1037",
    "Saint-Christophe-et-Niévès": "Q763",
    "Saint-Marin": "Q238",
    "Saint-Vincent-et-les-Grenadines": "Q757",
    "Sainte-Lucie": "Q760",
    Salvador: "Q792",
    Samoa: "Q683",
    "Sao Tomé-et-Principe": "Q1039",
    Sénégal: "Q1041",
    Serbie: "Q403",
    Seychelles: "Q1042",
    "Sierra Leone": "Q1044",
    Singapour: "Q334",
    Slovaquie: "Q214",
    Slovénie: "Q215",
    Somalie: "Q1045",
    Soudan: "Q1049",
    "Soudan du Sud": "Q958",
    "Sri Lanka": "Q854",
    Suède: "Q34",
    Suisse: "Q39",
    Suriname: "Q730",
    Syrie: "Q858",
    Tadjikistan: "Q863",
    Tanzanie: "Q924",
    Tchad: "Q657",
    Thaïlande: "Q869",
    "Timor oriental": "Q574",
    Togo: "Q945",
    Tonga: "Q678",
    "Trinité-et-Tobago": "Q754",
    Tunisie: "Q948",
    Turkménistan: "Q874",
    Turquie: "Q43",
    Tuvalu: "Q672",
    Ukraine: "Q212",
    Uruguay: "Q77",
    Vanuatu: "Q686",
    Vatican: "Q237",
    Venezuela: "Q717",
    Vietnam: "Q881",
    Yémen: "Q805",
    Zambie: "Q953",
    Zimbabwe: "Q954",
  };

  const sportIds = sports.map((sport) => sportMapping[sport]).filter(Boolean);
  const countryIds = countries
    .map((country) => countryMapping[country])
    .filter(Boolean);

  // Build dynamic SPARQL VALUES blocks
  const sportValues =
    sportIds.length > 0 ? sportIds.map((id) => `wd:${id}`).join(" ") : null;
  const countryValues =
    countryIds.length > 0 ? countryIds.map((id) => `wd:${id}`).join(" ") : null;

  // Construct the SPARQL query
  const query = `
    SELECT DISTINCT ?item ?itemLabel ?matchType WHERE {
      SERVICE wikibase:mwapi {
        bd:serviceParam wikibase:endpoint "www.wikidata.org";
                        wikibase:api "EntitySearch";
                        mwapi:search "${input}";
                        mwapi:language "fr".
        ?item wikibase:apiOutputItem mwapi:item.
      }

      # Restrict to athletes or teams
      {
        ?item wdt:P31 wd:Q5;                 # Instance of Human
              wdt:P641 ?sport.               # Associated with a sport
        ${sportValues ? `VALUES ?sport { ${sportValues} }` : ""}
        ${
          countryValues
            ? `?item wdt:P27 ?country. VALUES ?country { ${countryValues} }`
            : ""
        }
        BIND("athlete" AS ?matchType)
      }
      UNION
      {
        ?item wdt:P31/wdt:P279* wd:Q847017;  # Sports teams or subclasses
              wdt:P641 ?sport.               # Associated with a sport
        ${sportValues ? `VALUES ?sport { ${sportValues} }` : ""}
        ${
          countryValues
            ? `?item wdt:P17 ?country. VALUES ?country { ${countryValues} }`
            : ""
        }
        BIND("team" AS ?matchType)
      }

      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
    }
    LIMIT 50
  `;

  console.log(`Generated SPARQL Query:\n${query}`); // Debug query

  try {
    // Send the query to Wikidata
    const url = `${wikidataEndPoint}?query=${encodeURIComponent(
      query
    )}&format=json`;
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error("Failed to fetch data from Wikidata");
    }

    const data = await response.json();
    const bindings = data.results.bindings;

    // Process the results
    const results = bindings.map((binding) => ({
      id: "wd:" + binding.item.value.split("/").pop(),
      label: binding.itemLabel.value,
      matchType: binding.matchType.value, // "athlete" or "team"
    }));

    res.send(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});
