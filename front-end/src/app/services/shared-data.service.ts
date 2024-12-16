import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private sportsFiltersSource = new BehaviorSubject<string[]>([]);
  private countriesFiltersSource = new BehaviorSubject<string[]>([]);
  private sportCarouselSource = new BehaviorSubject<any>({});
  private informationSource = new BehaviorSubject<any>({}); // for athletes and teams

  sportsFilters$ = this.sportsFiltersSource.asObservable();
  countriesFilters$ = this.countriesFiltersSource.asObservable();
  sportCarousel$ = this.sportCarouselSource.asObservable();
  information$ = this.informationSource.asObservable();


  updateSportsFilters(filters: string[]) {
    this.sportsFiltersSource.next(filters);
  }

  updateCountriesFilters(filters: string[]) {
    this.countriesFiltersSource.next(filters);
  }

  sendSportCarousel(json : any) {
    this.sportCarouselSource.next(json);
  }

  sendInformation(json : any) {
    this.informationSource.next(json);
  }
}
