import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from './recipe';
import { environment } from '../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private url = environment.BACKEND_URL;

  recipes$ = signal<Recipe[]>([]);
  recipe$ = signal<Recipe>({} as Recipe);

  constructor(private httpClient: HttpClient) {}

  private refreshRecipes() {
    return this.httpClient
      .get<Recipe[]>(this.url)
      .pipe(
        tap((recipes) => this.recipes$.set(recipes)),
        catchError((error) => {
          console.error('Error fetching recipes:', error);
          return of(null);
        })
      )
      .subscribe(); // Subscribe to trigger the HTTP request
  }

  getRecipes() {
    this.refreshRecipes();
    return this.recipes$();
  }

  getRecipe(id: string): Observable<Recipe | null> {
    return this.httpClient.get<Recipe>(`${this.url}/${id}`).pipe(
      tap((recipe) => this.recipe$.set(recipe)),
      catchError((error) => {
        console.error('Error fetching recipe:', error);
        return of(null);
      })
    );
  }

  createRecipe(recipe: Recipe): Observable<any> {
    return this.httpClient
      .post(
        this.url,
        { ...recipe, createdAt: new Date(), updatedAt: new Date() },
        { responseType: 'text' }
      )
      .pipe(
        catchError((error) => {
          console.error('Error creating recipe:', error);
          return of(null); // Handle the error gracefully
        })
      );
  }

  updateRecipe(id: string, recipe: Recipe): Observable<any> {
    return this.httpClient
      .put(
        `${this.url}/${id}`,
        { ...recipe, updatedAt: new Date() },
        { responseType: 'text' }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating recipe:', error);
          return of(null); // Handle the error gracefully
        })
      );
  }
  deleteRecipe(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.url}/${id}`, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Error deleting recipe:', error);
          return of(null); // Handle the error gracefully
        })
      );
  }
}
