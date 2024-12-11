class Team {
    constructor(name, players, information, sport, region, leagueWins, logoImage) { 
        this.name = name;
        this.players = players;
        this.information = information;
        this.sport = sport;
        this.region = region;
        this.leagueWins = leagueWins;
        this.logoImage = logoImage;
    }
}

module.exports = Team;