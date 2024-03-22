import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { NgModule } from "@angular/core";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { ShoppingEditComponent } from "./shopping-list/shopping-edit/shopping-edit.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipesResolverService } from "./recipes/recipes-resolver.service";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes  =  [
    {path: '', redirectTo: '/recipes', pathMatch: 'full' },
    /* pathMatch: 'full' assicura che il reindirizzamento avvenga solo quando il percorso corrente è esattamente
    uguale al percorso specificato (in questo caso, '/recipes').*/
    {path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
        {path: '', component: RecipeStartComponent},
        {path: 'new', component: RecipeEditComponent},
        {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
        {path: ':id/edit', component: RecipeEditComponent}
    ]},
    {path: 'shopping-list', component: ShoppingListComponent, children: [
        {path: 'edit', component: ShoppingEditComponent},
    ]},
    {path: 'auth', component: AuthComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
})
export class AppRoutingModule{}