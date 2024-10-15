import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Recipe Book' },
  {
    path: 'create',
    component: CreateRecipeComponent,
    title: 'Create new Recipe',
  },
  {
    path: 'details/:id',
    component: RecipeDetailsComponent,
    title: 'Single Recipe',
  },
  { path: '**', component: PageNotFoundComponent, title: '404 Page not found' },
];
