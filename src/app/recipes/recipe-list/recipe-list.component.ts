import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a test', 'https://www.giallozafferano.it/images/242-24299/Churros_450x300.jpg'),
    new Recipe('A Test Recipe', 'This is a test', 'https://www.giallozafferano.it/images/242-24299/Churros_450x300.jpg'),
    new Recipe('A Test Recipe', 'This is a test', 'https://www.giallozafferano.it/images/242-24299/Churros_450x300.jpg')
  ];
}
