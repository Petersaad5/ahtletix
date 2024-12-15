class Athlete {
    constructor(name, sport, gender, nationality, height, weight, team, image, signature, birthDate, deathDate, placeOfBirth, position, teams, awards, socialMediaFollowers, nickname) {
        this.name = name;   // P1559
        this.sport = sport; // P641
        this.gender = gender; // P21
        this.nationality = nationality; // P27
        this.height = height; // P2048
        this.weight = weight; // P2067
        this.team = team; // P54
        this.image = image; // P18
        this.signature = signature; // P109
        this.birthDate = birthDate; // P569
        this.deathDate = deathDate; // P570
        this.placeOfBirth = placeOfBirth; // P19
        this.position = position; // P413
        this.teams = teams; // P54
        this.awards = awards; // P166
        this.socialMediaFollowers = socialMediaFollowers; // P8687
        this.nickname = nickname; // P1449
    }
}

module.exports = Athlete;