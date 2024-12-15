import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sport-page',
  templateUrl: './sport-page.component.html',
  styleUrls: ['./sport-page.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class SportPageComponent implements OnInit {
  sport: any = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('sport.json').subscribe(data => {
      this.sport = data;
    });
  }
}