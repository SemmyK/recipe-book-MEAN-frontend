import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { CommonModule } from '@angular/common';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateRecipeComponent {
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private recipeService: RecipeService = inject(RecipeService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  recipeForm: FormGroup;
  ingredientInput: string = '';
  ingredients: WritableSignal<string[]> = signal([]);
  ingredientControl = this.formBuilder.control('', Validators.required);

  constructor() {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      cookingTime: ['', [Validators.required, Validators.min(1)]],
      method: ['', Validators.required],
      type: ['meal'],
    });

    this.ingredientControl.valueChanges.subscribe((value) => {});
  }

  onFormSubmitted(formValues: any) {
    this.openSnackBar('Successfully added recipe.', 'Close', 'success');
    this.recipeService.getRecipes();
    this.router.navigate(['/']);
  }

  addIngredient() {
    const ingredientValue = this.ingredientControl.value;
    if (ingredientValue && ingredientValue.trim()) {
      if (!this.ingredients().includes(ingredientValue.trim())) {
        this.ingredients.update((prev) => [...prev, ingredientValue.trim()]);
        this.ingredientControl.setValue('');
      } else {
        this.openSnackBar(
          'You already have that ingredient added.',
          'Close',
          'error'
        );
      }
    } else {
      this.openSnackBar('Nothing there to add.', 'Close', 'error');
    }
  }

  submit() {
    if (this.recipeForm.valid && this.ingredients().length !== 0) {
      const recipeData = {
        title: this.recipeForm.value.title,
        type: this.recipeForm.value.type,
        ingredients: this.ingredients(),
        cookingTime: `${this.recipeForm.value.cookingTime} minutes`,
        method: `${this.recipeForm.value.method} Enjoy your meal!`,
        user: '',
      };

      this.recipeService.createRecipe(recipeData).subscribe({
        next: () => {
          this.recipeForm.reset();
          this.ingredients.set([]);
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar(
            'Something went wrong. Recipe not added.',
            'Close',
            'error'
          );
        },
      });
      this.onFormSubmitted(recipeData);
    }
  }

  openSnackBar(message: string, action: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      verticalPosition: 'top',
      duration: 2000,
      data: { message, type },
    });
  }
}
