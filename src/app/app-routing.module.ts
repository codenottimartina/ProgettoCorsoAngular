import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth/auth.component";

const appRoutes: Routes  =  [
    {path: '', redirectTo: '/recipes', pathMatch: 'full' },
    /* pathMatch: 'full' assicura che il reindirizzamento avvenga solo quando il percorso corrente è esattamente
    uguale al percorso specificato (in questo caso, '/recipes').*/
    {path: 'auth', component: AuthComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule{}