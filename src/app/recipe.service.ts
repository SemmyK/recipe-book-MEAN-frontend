import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from './recipe';
import { environment } from '../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private url = environment.BACKEND_URL;

  recipes$ = signal<Recipe[]>([]);
  recipe$ = signal<Recipe>({} as Recipe);

  constructor(private httpClient: HttpClient) {}

  private refreshRecipes() {
    this.httpClient
      .get<Recipe[]>(`${this.url}/api/recipes`)
      .subscribe((recipes) => {
        this.recipes$.set(recipes);
      });
  }

  getRecipes() {
    this.refreshRecipes();
    return this.recipes$();
  }

  getRecipe(id: string) {
    this.httpClient
      .get<Recipe>(`${this.url}/api/recipes/${id}`)
      .subscribe((recipe) => {
        this.recipe$.set(recipe);
        return this.recipe$();
      });
  }

  createRecipe(recipe: Recipe): Observable<any> {
    return this.httpClient
      .post(
        `${this.url}/api/recipes`,
        {
          ...recipe,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { responseType: 'text' }
      )
      .pipe(
        catchError((error) => {
          console.error('Error creating recipe:', error);
          return error;
        })
      );
  }

  updateRecipe(id: string, recipe: Recipe) {
    return this.httpClient.put(
      `${this.url}/api/recipes/${id}`,
      { ...recipe, updatedAt: new Date() },
      {
        responseType: 'text',
      }
    );
  }

  deleteRecipe(id: string) {
    return this.httpClient.delete(`${this.url}/api/recipes/${id}`, {
      responseType: 'text',
    });
  }
}
