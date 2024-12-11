import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FilterComponent {
  sportsFilters: string[] = []; // List of filters for sports
  countriesFilters: string[] = []; // List of filters for countries

  newFilter: string = ''; // Input for adding a new filter
  filterType: string = ''; // Type of filter selected ('sport' or 'country')

  // Add a filter dynamically based on the selected type
  addFilter() {
    if (this.filterType === 'sport') {
      this.sportsFilters.push(this.newFilter.trim());
    } else if (this.filterType === 'country') {
      this.countriesFilters.push(this.newFilter.trim());
    }
    this.newFilter = ''; // Clear the input field
  }

  // Remove a sport filter
  removeSportFilter(index: number) {
    this.sportsFilters.splice(index, 1);
  }

  // Remove a country filter
  removeCountryFilter(index: number) {
    this.countriesFilters.splice(index, 1);
  }
}
