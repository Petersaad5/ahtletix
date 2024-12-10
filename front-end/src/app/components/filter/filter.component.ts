import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Import CommonModule and FormsModule here
})
export class FilterComponent {
  filters: string[] = []; // Array to store the list of filters
  newFilter: string = ''; // Variable to store the new filter input

  // Method to add a new filter to the list
  addFilter() {
    if (this.newFilter.trim()) { // Check if the input is not empty or just whitespace
      this.filters.push(this.newFilter.trim()); // Add the new filter to the array
      this.newFilter = ''; // Clear the input field
    }
  }

  // Method to remove a filter from the list
  removeFilter(index: number) {
    this.filters.splice(index, 1); // Remove the filter at the specified index
  }
}