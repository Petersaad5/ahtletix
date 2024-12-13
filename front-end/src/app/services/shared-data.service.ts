import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  // BehaviorSubjects to hold and emit the filters
  private sportsFiltersSource = new BehaviorSubject<string[]>([]);
  private countriesFiltersSource = new BehaviorSubject<string[]>([]);

  // Observables for components to subscribe
  sportsFilters$ = this.sportsFiltersSource.asObservable();
  countriesFilters$ = this.countriesFiltersSource.asObservable();

  // Method to update sports filters
  updateSportsFilters(filters: string[]) {
    this.sportsFiltersSource.next(filters);
  }

  // Method to update countries filters
  updateCountriesFilters(filters: string[]) {
    this.countriesFiltersSource.next(filters);
  }
}
