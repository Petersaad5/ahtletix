import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class TeamPageComponent implements OnInit {
  team: any = {};

  constructor(private http: HttpClient, private sharedDataService : SharedDataService) { }

  ngOnInit(): void {
      this.sharedDataService.information$.subscribe((data) => {
      this.team = data.object;
    });
  }
}