import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private sharedDataService: SharedDataService, private router: Router) {}

  sendApiCarousel(sport : string) {
    this.http.get(`${this.backendUrl}/carouselSearch`, {
      params: { sport } // Converts to ?sport=value in the query string
    }).subscribe((data) => {
      this.sharedDataService.sendSportCarousel(data);
      this.router.navigate(['/sport']);
    });
  }
}
