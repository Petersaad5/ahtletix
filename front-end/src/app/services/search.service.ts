import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'http://localhost:3000/barsearch'; // Ensure this matches your backend endpoint

  constructor(private http: HttpClient) {}

  // Send search keywords and filters to the backend
  search(
    query: string,
    filters: { sports: string[]; countries: string[] }
  ): Observable<any> {
    const payload = {
      keywords: query,
      filters: {
        sports: filters.sports,
        countries: filters.countries,
      },
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}
