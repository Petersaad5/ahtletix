class Sport {
    // Constructor and attributes
    constructor(label, image, inception, authority, countryOfOrigin, icon, unicode, maxPlayers, minPlayers) {
        this.label = label; 
        this.image = image; //P18
        this.insception = inception; //P571
        this.authority = authority; //P797
        this.countryOfOrigin = countryOfOrigin; //P495
        this.icon = icon; //P2910
        this.unicode = unicode; //P487
        this.maxPlayers = maxPlayers; //P1873
        this.minPlayers = minPlayers; //P1872
    }
}

module.exports = Sport;