import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class TeamPageComponent implements OnInit {
  team: any = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('team.json').subscribe(data => {
      this.team = data;
    });
  }
}