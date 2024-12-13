import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  searchKeyWords: string = ''; // Holds the search input value
  athleteData: any = null;
  error: string = '';

  sportsFilters: string[] = []; // Sports filters received from the shared service
  countriesFilters: string[] = []; // Country filters received from the shared service

  constructor(
    private searchService: SearchService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    // Subscribe to sports filters
    this.sharedDataService.sportsFilters$.subscribe((filters) => {
      this.sportsFilters = filters;
    });

    // Subscribe to country filters
    this.sharedDataService.countriesFilters$.subscribe((filters) => {
      this.countriesFilters = filters;
    });
  }

  search() {
    if (!this.searchKeyWords.trim()) {
      alert('Veuillez entrer un terme de recherche.');
      return;
    }

    // Prepare the filters
    const filters = {
      sports: this.sportsFilters,
      countries: this.countriesFilters,
    };

    // Send the search request to the backend
    this.searchService.search(this.searchKeyWords, filters).subscribe({
      next: (data) => {
        this.athleteData = data;
        console.log('Search Results:', data);
        this.error = '';
      },
      error: (err) => {
        this.error = 'Erreur lors de la recherche. Veuillez réessayer.';
        console.error(err);
      },
    });
  }
}
