import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from '../loading-page/loading-page.component';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, LoadingPageComponent],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent {
  recipe$ = {} as WritableSignal<Recipe>;
  route: ActivatedRoute = inject(ActivatedRoute);
  singleRecipeService: RecipeService = inject(RecipeService);
  loading = signal(false);

  constructor() {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      alert('No id provided');
    }
    this.loading.set(true);
    this.singleRecipeService.getRecipe(id!).subscribe((recipe) => {
      this.recipe$.set(recipe!);
    });
    this.recipe$ = this.singleRecipeService.recipe$;

    setTimeout(() => {
      this.recipe && this.loading.set(false);
    }, 5000);
  }

  get recipe(): Recipe {
    return this.recipe$();
  }
}
