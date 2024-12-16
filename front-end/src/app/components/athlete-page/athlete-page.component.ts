import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-athlete-page',
  templateUrl: './athlete-page.component.html',
  styleUrls: ['./athlete-page.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class AthletePageComponent implements OnInit {
  player: any = {};

  constructor(private http: HttpClient, private sharedDataService : SharedDataService) { }

  ngOnInit(): void {
    this.sharedDataService.information$.subscribe((data) => {
      this.player = data.object;
    });
  }
}