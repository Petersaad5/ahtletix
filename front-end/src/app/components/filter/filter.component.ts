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
    'Arabie Saoudite',
    'Argentine',
    'Arménie',
    'Australie',
    'Autriche',
    'Azerbaïdjan',
    'Bahamas',
    'Bangladesh',
    'Belgique',
    'Bénin',
    'Bhoutan',
    'Brésil',
    'Burkina Faso',
    'Cambodge',
    'Cameroun',
    'Canada',
    'Chili',
    'Chine',
    'Congo-Brazzaville',
    'Côte d’Ivoire',
    'Croatie',
    'Cuba',
    'Danemark',
    'Égypte',
    'Espagne',
    'États-Unis',
    'France',
    'Ghana',
    'Grèce',
    'Guinée',
    'Haïti',
    'Inde',
    'Indonésie',
    'Italie',
    'Japon',
    'Liban',
    'Maroc',
    'Mali',
    'Mexique',
    'Nigéria',
    'Norvège',
    'Pays-Bas',
    'Pologne',
    'Portugal',
    'Royaume-Uni',
    'Russie',
    'Sénégal',
    'Suisse',
    'Suède',
    'Tanzanie',
    'Tunisie',
    'Turquie',
    'Ukraine',
    'Venezuela',
    'Vietnam',
    'Zimbabwe',
  ].sort();

  // Full list of sports in French
  sportsList: string[] = [
    'Athlétisme',
    'Aviron',
    'Badminton',
    'Baseball',
    'Basket-ball',
    'Cyclisme',
    'Escrime',
    'Football',
    'Gymnastique',
    'Handball',
    'Judo',
    'Karaté',
    'Natation',
    'Rugby',
    'Tennis',
    'Volley-ball',
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
