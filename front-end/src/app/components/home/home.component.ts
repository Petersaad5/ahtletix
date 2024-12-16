import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilterComponent } from '../filter/filter.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, CarouselComponent, FilterComponent], // Add FooterComponent here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}