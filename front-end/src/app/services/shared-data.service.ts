import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private sportsFiltersSource = new BehaviorSubject<string[]>([]);
  private countriesFiltersSource = new BehaviorSubject<string[]>([]);

  sportsFilters$ = this.sportsFiltersSource.asObservable();
  countriesFilters$ = this.countriesFiltersSource.asObservable();

  updateSportsFilters(filters: string[]) {
    this.sportsFiltersSource.next(filters);
  }

  updateCountriesFilters(filters: string[]) {
    this.countriesFiltersSource.next(filters);
  }
}
