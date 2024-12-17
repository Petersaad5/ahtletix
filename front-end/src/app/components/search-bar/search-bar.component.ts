import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { SharedDataService } from '../../services/shared-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchResult } from '../../search-result';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  private apiCallsToBack : Subscription = Subscription.EMPTY; // latest API call to the backend to unsubscribe if a new one is made
  private backendUrl = 'http://localhost:3000';

  constructor(
    private searchService: SearchService,
    private sharedDataService: SharedDataService,
    private http: HttpClient,
    private router: Router
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
      let sports = this.sportsFilters.join(',');
      let countries = this.countriesFilters.join(',');

      // Send API call to the backend
      if(this.apiCallsToBack !== Subscription.EMPTY) {
        this.apiCallsToBack.unsubscribe();
      }
      this.apiCallsToBack = this.http.get<SearchResult[]>(`${this.backendUrl}/autoCompletion`, {
          params: {
            input: input,
            sports: sports,
            countries: countries,
          },
        })
        .subscribe((data: SearchResult[]) => {
          this.autocompleteDisplay = true;
          this.suggestions = data;
          this.playerSuggestions = data.filter(
            (suggestion) => suggestion.matchType === 'athlete'
          );
          this.teamSuggestions = data.filter(
            (suggestion) => suggestion.matchType === 'team'
          );
        });
    } else {
      this.autocompleteDisplay = false;
    }
  }

  loadInformationPage(suggestion: SearchResult) {
    // Send API call to the backend
    this.http
      .get(`${this.backendUrl}/searchBar`, {
        params: { input: suggestion.id, typeOfSearch: suggestion.matchType },
      })
      .subscribe((data) => {
        this.sharedDataService.sendInformation(data);
        this.router.navigate([`/${suggestion.matchType}`]);
      });
  }
}
