import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SearchResult } from '../../search-result';
import { SharedDataService } from '../../services/shared-data.service'; // Make sure this path is correct
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  searchKeyWords: string = '';
  autocompleteDisplay: boolean = false;
  suggestions: SearchResult[] = [];
  playerSuggestions: SearchResult[] = [];
  teamSuggestions: SearchResult[] = [];
  isLoading: boolean = false; // Tracks the loading state

  private apiCallsToBack: Subscription = Subscription.EMPTY;
  private backendUrl = 'http://localhost:3000';

  // searchKeyWords: string = '';
  athleteData: any = null;
  error: string = '';
  // autocompleteDisplay: boolean = false;
  // suggestions: SearchResult[] = [];
  // playerSuggestions: SearchResult[] = [];
  // teamSuggestions: SearchResult[] = [];
  sportsFilters: string[] = [];
  countriesFilters: string[] = [];
  // private apiCallsToBack: Subscription = Subscription.EMPTY; // latest API call to the backend to unsubscribe if a new one is made
  // private backendUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedDataService: SharedDataService // Inject SharedDataService here
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
      if (this.apiCallsToBack !== Subscription.EMPTY) {
        this.apiCallsToBack.unsubscribe();
      }
      this.apiCallsToBack = this.http
        .get<SearchResult[]>(`${this.backendUrl}/autoCompletion`, {
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
    this.isLoading = true; // Show the loading screen

    this.http
      .get(`${this.backendUrl}/searchBar`, {
        params: { input: suggestion.id, typeOfSearch: suggestion.matchType },
      })
      .subscribe({
        next: (data) => {
          this.sharedDataService.sendInformation(data);
          this.router.navigate([`/${suggestion.matchType}`]);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.isLoading = false; // Stop loading on error
        },
      });

    // Reset loading state when navigation completes
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.isLoading = false; // Stop loading after navigation ends
      });
  }
}
