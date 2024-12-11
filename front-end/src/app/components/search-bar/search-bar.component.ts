import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule], // Include FormsModule and CommonModule
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchKeyWords: string = ''; // Holds the search input value
  athleteData: any = null;
  error: string = '';

  sportsFilters: string[] = []; // Assuming you have access to these filters
  countriesFilters: string[] = []; // Assuming you have access to these filters

  constructor(private searchService: SearchService) {}

  search() {
    if (!this.searchKeyWords.trim()) {
      this.error = 'Veuillez entrer un terme de recherche.';
      return;
    }

    // Sort filters
    const sortedSportsFilters = [...this.sportsFilters].sort();
    const sortedCountriesFilters = [...this.countriesFilters].sort();

    // Log sorted filters and search keywords
    console.log('Search Keywords:', this.searchKeyWords);
    console.log('Sorted Sports Filters:', sortedSportsFilters);
    console.log('Sorted Countries Filters:', sortedCountriesFilters);

    // Call the search service
    this.searchService.search(this.searchKeyWords).subscribe({
      next: (data) => {
        this.athleteData = data;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Erreur lors de la recherche. Veuillez réessayer.';
        console.error(err);
      },
    });
  }
}
