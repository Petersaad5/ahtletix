import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private resultsSubject = new BehaviorSubject<any[]>([]);
  results$ = this.resultsSubject.asObservable();

  search(query: string) {
    // ici on met le code pour faire la recherche de meow meow
    const mockResults = ['Athlete 1', 'Athlete 2', 'Athlete 3'];
    this.resultsSubject.next(mockResults);
  }
}