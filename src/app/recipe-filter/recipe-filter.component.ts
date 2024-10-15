import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-filter.component.html',
  styleUrl: './recipe-filter.component.css',
})
export class RecipeFilterComponent {
  @Input() currentFilter: string = 'all';
  @Output() filterChange = new EventEmitter<string>();

  filterList: string[] = [
    'all',
    'meal',
    'soup',
    'salad',
    'smoothie',
    'snack',
    'sauce',
    'side',
    'dessert',
  ];

  onFilterChange(newFilter: string): void {
    this.filterChange.emit(newFilter);
  }
}
