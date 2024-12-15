import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AthletePageComponent } from './components/athlete-page/athlete-page.component';
import { TeamPageComponent } from './components/team-page/team-page.component';
import { SportPageComponent } from './components/sport-page/sport-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'athlete', component: AthletePageComponent },
  { path: 'team', component: TeamPageComponent },
  { path: 'sport', component: SportPageComponent }
];