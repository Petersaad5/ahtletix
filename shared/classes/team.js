class Team {
    constructor(instanceOf, inception, label, image, logo, nickname, country, sport, sponsor, homeVenue, league, foundedBy, headQuarters, officialWebsite, kitSupplier, socialMediaFollowers, coach) { 
        this.instanceOf = instanceOf; // P31
        this.inception = inception; // P571
        this.label = label; // RDFS:label
        this.image = image; // P18
        this.logo = logo; // P154
        this.nickname = nickname; // P1449
        this.country = country; // P17
        this.sport = sport; // P641
        this.sponsor = sponsor; // P859
        this.homeVenue = homeVenue; // P115
        this.league = league; // P118
        this.foundedBy = foundedBy; // P112
        this.headQuarters = headQuarters; // P159
        this.officialWebsite = officialWebsite; // P856
        this.kitSupplier = kitSupplier; // P5995
        this.socialMediaFollowers = socialMediaFollowers; // P8687
        this.coach = coach; // P286
    }   
}

module.exports = Team;