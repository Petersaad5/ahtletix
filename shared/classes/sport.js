class Sport {
    // Constructor and attributes
    constructor(name, nbPlayers, placeToPlay, information, image, firstPlayed, associationName, countries, randomTeams, randomPlayers) {
        this.name = name;
        this.nbPlayers = nbPlayers;
        this.information = information;
        this.placeToPlay = placeToPlay;
        this.image = image;
        this.firstPlayed = firstPlayed;
        this.associationName = associationName;
        this.countries = countries;
        this.randomTeams = randomTeams;
        this.randomPlayers = randomPlayers;
    }
}

module.exports = Sport;