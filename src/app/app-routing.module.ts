import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const appRoutes: Routes  =  [
    {path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)},
    { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) }
    /* pathMatch: 'full' assicura che il reindirizzamento avvenga solo quando il percorso corrente è esattamente
    uguale al percorso specificato (in questo caso, '/recipes').*/
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule],
})
export class AppRoutingModule{}