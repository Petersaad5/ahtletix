import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'http://localhost:3000/basketball/teams'; // Ensure this matches your backend

  constructor(private http: HttpClient) {}

  // Fetch data from the backend
  search(query: string): Observable<any> {
    // Send the query as a parameter to the backend
    return this.http.get<any>(
      `${this.apiUrl}?name=${encodeURIComponent(query)}`
    );
  }
}
