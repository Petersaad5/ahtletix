import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FilterComponent {
  countriesFilters: string[] = []; // List of selected countries
  sportsFilters: string[] = []; // List of selected sports

  countrySearch: string = ''; // Input for searching countries
  sportSearch: string = ''; // Input for searching sports
  filterType: string = ''; // Type of filter selected ('sport' or 'country')

  // Full list of countries in French
  countryList: string[] = [
    'Afghanistan',
    'Afrique du Sud',
    'Albanie',
    'Algérie',
    'Allemagne',
    'Andorre',
    'Angola',
    'Antigua-et-Barbuda',
    'Arabie Saoudite',
    'Argentine',
    'Arménie',
    'Australie',
    'Autriche',
    'Azerbaïdjan',
    'Bahamas',
    'Bahreïn',
    'Bangladesh',
    'Barbade',
    'Belgique',
    'Belize',
    'Bénin',
    'Bhoutan',
    'Biélorussie',
    'Birmanie',
    'Bolivie',
    'Bosnie-Herzégovine',
    'Botswana',
    'Brésil',
    'Brunei',
    'Bulgarie',
    'Burkina Faso',
    'Burundi',
    'Cambodge',
    'Cameroun',
    'Canada',
    'Cap-Vert',
    'Chili',
    'Chine',
    'Chypre',
    'Colombie',
    'Comores',
    'Congo-Brazzaville',
    'Congo-Kinshasa',
    'Corée du Nord',
    'Corée du Sud',
    'Costa Rica',
    'Côte d’Ivoire',
    'Croatie',
    'Cuba',
    'Danemark',
    'Djibouti',
    'Dominique',
    'Égypte',
    'Émirats Arabes Unis',
    'Équateur',
    'Érythrée',
    'Espagne',
    'Eswatini',
    'Estonie',
    'États-Unis',
    'Éthiopie',
    'Fidji',
    'Finlande',
    'France',
    'Gabon',
    'Gambie',
    'Géorgie',
    'Ghana',
    'Grèce',
    'Grenade',
    'Guatemala',
    'Guinée',
    'Guinée-Bissau',
    'Guinée équatoriale',
    'Guyana',
    'Haïti',
    'Honduras',
    'Hongrie',
    'Îles Marshall',
    'Îles Salomon',
    'Inde',
    'Indonésie',
    'Irak',
    'Iran',
    'Irlande',
    'Islande',
    'Israël',
    'Italie',
    'Jamaïque',
    'Japon',
    'Jordanie',
    'Kazakhstan',
    'Kenya',
    'Kirghizistan',
    'Kiribati',
    'Kosovo',
    'Koweït',
    'Laos',
    'Lesotho',
    'Lettonie',
    'Liban',
    'Libéria',
    'Libye',
    'Liechtenstein',
    'Lituanie',
    'Luxembourg',
    'Macédoine du Nord',
    'Madagascar',
    'Malaisie',
    'Malawi',
    'Maldives',
    'Mali',
    'Malte',
    'Maroc',
    'Maurice',
    'Mauritanie',
    'Mexique',
    'Micronésie',
    'Moldavie',
    'Monaco',
    'Mongolie',
    'Monténégro',
    'Mozambique',
    'Namibie',
    'Nauru',
    'Népal',
    'Nicaragua',
    'Niger',
    'Nigéria',
    'Norvège',
    'Nouvelle-Zélande',
    'Oman',
    'Ouganda',
    'Ouzbékistan',
    'Pakistan',
    'Palaos',
    'Panama',
    'Papouasie-Nouvelle-Guinée',
    'Paraguay',
    'Pays-Bas',
    'Pérou',
    'Philippines',
    'Pologne',
    'Portugal',
    'Qatar',
    'République Centrafricaine',
    'République Dominicaine',
    'République Tchèque',
    'Roumanie',
    'Royaume-Uni',
    'Russie',
    'Rwanda',
    'Saint-Christophe-et-Niévès',
    'Saint-Marin',
    'Saint-Vincent-et-les-Grenadines',
    'Sainte-Lucie',
    'Salvador',
    'Samoa',
    'Sao Tomé-et-Principe',
    'Sénégal',
    'Serbie',
    'Seychelles',
    'Sierra Leone',
    'Singapour',
    'Slovaquie',
    'Slovénie',
    'Somalie',
    'Soudan',
    'Soudan du Sud',
    'Sri Lanka',
    'Suède',
    'Suisse',
    'Suriname',
    'Syrie',
    'Tadjikistan',
    'Tanzanie',
    'Tchad',
    'Thaïlande',
    'Timor oriental',
    'Togo',
    'Tonga',
    'Trinité-et-Tobago',
    'Tunisie',
    'Turkménistan',
    'Turquie',
    'Tuvalu',
    'Ukraine',
    'Uruguay',
    'Vanuatu',
    'Vatican',
    'Venezuela',
    'Vietnam',
    'Yémen',
    'Zambie',
    'Zimbabwe',
  ].sort();

  // Full list of sports in French
  sportsList: string[] = [
    'Aviron',
    'Athlétisme',
    'Badminton',
    'Baseball',
    'Basket-ball',
    'Biathlon',
    'Boxe',
    'Canoë-kayak',
    'Canoë-polo',
    'Course à pied',
    'Cyclisme',
    'Escrime',
    'Equitation',
    'Football',
    'Golf',
    'Gymnastique',
    'Handball',
    'Haltérophilie',
    'Hockey sur gazon',
    'Hockey sur glace',
    'Judo',
    'Karaté',
    'Lutte',
    'Natation',
    'Patinage artistique',
    'Patinage de vitesse',
    'Pêche sportive',
    'Pétanque',
    'Plongée',
    'Rugby',
    'Ski alpin',
    'Ski de fond',
    'Snowboard',
    'Softball',
    'Squash',
    'Surf',
    'Taekwondo',
    'Tennis',
    'Tennis de table',
    "Tir à l'arc",
    'Tir sportif',
    'Triathlon',
    'Voile',
    'Volley-ball',
    'Water-polo',
    'Windsurf',
  ].sort();

  filteredCountries: string[] = []; // Filtered countries for dropdown
  filteredSports: string[] = []; // Filtered sports for dropdown

  constructor(private sharedDataService: SharedDataService) {}

  private normalizeString(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  get filterSearch(): string {
    return this.filterType === 'country'
      ? this.countrySearch
      : this.sportSearch;
  }

  set filterSearch(value: string) {
    if (this.filterType === 'country') {
      this.countrySearch = value;
      this.onCountrySearch();
    } else if (this.filterType === 'sport') {
      this.sportSearch = value;
      this.onSportSearch();
    }
  }

  onCountrySearch() {
    const search = this.normalizeString(this.countrySearch.trim());
    this.filteredCountries = search
      ? this.countryList.filter((country) =>
          this.normalizeString(country).includes(search)
        )
      : [];
  }

  onSportSearch() {
    const search = this.normalizeString(this.sportSearch.trim());
    this.filteredSports = search
      ? this.sportsList.filter((sport) =>
          this.normalizeString(sport).includes(search)
        )
      : [];
  }

  selectCountry(country: string) {
    if (!this.countriesFilters.includes(country)) {
      this.countriesFilters.push(country);
    }
    this.countrySearch = ''; // Clear the input field
    this.filteredCountries = []; // Clear the dropdown
  }

  selectSport(sport: string) {
    if (!this.sportsFilters.includes(sport)) {
      this.sportsFilters.push(sport);
    }
    this.sportSearch = ''; // Clear the input field
    this.filteredSports = []; // Clear the dropdown
  }

  removeCountryFilter(index: number) {
    this.countriesFilters.splice(index, 1);
  }

  removeSportFilter(index: number) {
    this.sportsFilters.splice(index, 1);
  }
}
