import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchKeyWords: string = ''; // Updated property name
  athleteData: any = null;
  error: string = '';

  constructor(private searchService: SearchService) {}

  search() {
    if (!this.searchKeyWords.trim()) {
      this.error = 'Please enter a search term.';
      return;
    }

    this.searchService.search(this.searchKeyWords).subscribe({
      next: (data) => {
        this.athleteData = data;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to fetch data. Please try again.';
        console.error(err);
      },
    });
  }
}
