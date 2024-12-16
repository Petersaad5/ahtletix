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

  calculateAge(birthDate: any): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}