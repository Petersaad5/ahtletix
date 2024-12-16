import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-sport-page',
  templateUrl: './sport-page.component.html',
  styleUrls: ['./sport-page.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class SportPageComponent implements OnInit {
  sport: any = {};

  constructor(private http: HttpClient, private sharedDataService : SharedDataService) { }

  ngOnInit(): void {
    this.sharedDataService.sportCarousel$.subscribe((data) => {
      this.sport = data;
      console.log(this.sport);
    });
  }
}