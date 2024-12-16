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
  searchKeyWords: string = '';
  athleteData: any = null;
  error: string = '';

  sportsFilters: string[] = [];
  countriesFilters: string[] = [];

  constructor(
    private searchService: SearchService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.sharedDataService.sportsFilters$.subscribe((filters) => {
      this.sportsFilters = filters;
    });
    this.sharedDataService.countriesFilters$.subscribe((filters) => {
      this.countriesFilters = filters;
    });
  }

  search() {
    if (!this.searchKeyWords.trim()) {
      alert('Veuillez entrer un terme de recherche.');
      return;
    }

    const filters = {
      sports: this.sportsFilters,
      countries: this.countriesFilters,
    };

    //console.log('Filters sent to backend:', filters);

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
