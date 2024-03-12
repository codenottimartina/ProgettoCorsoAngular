import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];

    getingredients(){
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredientsToAdd: Ingredient[]){
        this.ingredients.push(...ingredientsToAdd); // spread operator -> push accetta più elementi ma non un array
        this.ingredientsChanged.next(this.ingredients.slice());
        console.log(this.ingredients.length);
    }
}