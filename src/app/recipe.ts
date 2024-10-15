export interface Recipe {
  title: string;
  cookingTime: string;
  method: string;
  user: string;
  type:
    | 'meal'
    | 'soup'
    | 'salad'
    | 'smoothie'
    | 'snack'
    | 'sauce'
    | 'side'
    | 'dessert';
  ingredients: string[];
  _id?: string;
}
