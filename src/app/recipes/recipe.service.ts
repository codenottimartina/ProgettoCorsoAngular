import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Pizza',
    //         'A super pizza!',
    //         'https://www.giallozafferano.it/images/249-24919/Pizza-napoletana_450x300.jpg',
    //         [
    //             new Ingredient('Flour', 1),
    //             new Ingredient('Oil', 1),
    //             new Ingredient('Salt', 1),
    //             new Ingredient('Tomato', 1),
    //             new Ingredient('Mozzarella', 2),
    //         ]
    //     ),
    //     new Recipe(
    //         'Lasagne',
    //         'the best lasagna in the world!',
    //         'https://www.giallozafferano.it/images/269-26910/Lasagne-al-forno_450x300.jpg',
    //         [
    //             new Ingredient('Tomato', 1),
    //             new Ingredient('Meat', 1),
    //             new Ingredient('Ham', 1),
    //             new Ingredient('Cheese', 1),
    //             new Ingredient('Lasagna egg pasta', 1)
    //         ]),
    //     new Recipe(
    //         'Carbonara',
    //         'A fantastic carbonara pasta',
    //         'https://www.giallozafferano.it/images/244-24489/Spaghetti-alla-Carbonara_450x300_sp.jpg',
    //         [
    //             new Ingredient('Pasta', 1),
    //             new Ingredient('Eggs', 5),
    //             new Ingredient('Pecorino', 2),
    //             new Ingredient('Guanciale', 1),
    //             new Ingredient('Black pepper', 1)
    //         ]
    //     )
    // ];

    private recipes: Recipe[] = [];
    
    constructor(private slService: ShoppingListService){}

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes(){
        return this.recipes.slice(); // restituisce una copia dell'array recipes
    }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}