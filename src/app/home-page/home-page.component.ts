import { Component, signal, WritableSignal } from '@angular/core';
import { RecipeFilterComponent } from '../recipe-filter/recipe-filter.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingPageComponent } from '../loading-page/loading-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RecipeFilterComponent,
    RecipeListComponent,
    LoadingPageComponent,
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  recipes$ = {} as WritableSignal<Recipe[]>;
  currentFilter = signal('all') as WritableSignal<string>;
  loading = signal(false);

  constructor(
    private recipesService: RecipeService,
    private spinner: NgxSpinnerService
  ) {
    this.recipesService.getRecipes();
  }

  ngOnInit() {
    this.fetchRecipes();
  }

  private fetchRecipes(): void {
    this.loading.set(true);
    this.recipes$ = this.recipesService.recipes$;
    this.recipesService.getRecipes();

    setTimeout(() => {
      this.recipes && this.loading.set(false);
    }, 5000);
  }

  get recipes(): Recipe[] {
    return this.recipes$();
  }

  changeFilter(newFilter: string): void {
    this.currentFilter.set(newFilter);
  }

  get filteredRecipes() {
    return this.currentFilter() === 'all'
      ? this.recipes
      : this.recipes.filter((recipe) => recipe.type === this.currentFilter());
  }
}
