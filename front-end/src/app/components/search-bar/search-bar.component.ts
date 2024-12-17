import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { SharedDataService } from '../../services/shared-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchResult } from '../../search-result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchKeyWords: string = '';
  athleteData: any = null;
  error: string = '';
  autocompleteDisplay: boolean = false; 
  suggestions: SearchResult[] = [];
  playerSuggestions: SearchResult[] = [];
  teamSuggestions: SearchResult[] = [];
  sportsFilters: string[] = [];
  countriesFilters: string[] = [];
  private backendUrl = 'http://localhost:3000';

  constructor(
    private searchService: SearchService,
    private sharedDataService: SharedDataService, 
    private http : HttpClient, 
    private router : Router
  ) {}

  getFilters() {
    this.sharedDataService.sportsFilters$.subscribe((filters) => {
      this.sportsFilters = filters;
    });
    this.sharedDataService.countriesFilters$.subscribe((filters) => {
      this.countriesFilters = filters;
    });
  }


  autocompleteLoad(input: string) {
    if (input.length > 2) {
      this.getFilters(); // initialize filters in the component
      let filters = {
        sports: this.sportsFilters,
        countries: this.countriesFilters,
      };

      // Send API call to the backend
      this.http.get<SearchResult[]>(`${this.backendUrl}/autoCompletion`, {
        params: { 
          input : input, 
          filters : JSON.stringify(filters)
        } 
      }).subscribe((data: SearchResult[]) => {
        this.autocompleteDisplay = true;
        this.suggestions = data;
        this.playerSuggestions = data.filter(suggestion => suggestion.matchType === 'athlete');
        this.teamSuggestions = data.filter(suggestion => suggestion.matchType === 'team');
      });
    } else {
      this.autocompleteDisplay = false;
    }
  }

  loadInformationPage(suggestion : SearchResult) {
    // Send API call to the backend
    this.http.get(`${this.backendUrl}/searchBar`, {
      params : { input : suggestion.id, typeOfSearch : suggestion.matchType }
    }).subscribe((data) => {
      this.sharedDataService.sendInformation(data);
      this.router.navigate([`/${suggestion.matchType}`]);
    });
  }
}