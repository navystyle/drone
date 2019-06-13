import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const rootPath = 'src/app';
const routes: Routes = [
    {pathMatch: 'full', path: '', redirectTo: 'main'},
    {pathMatch: 'full', path: 'main', loadChildren: `${rootPath}/layout/main/main.module#MainModule`},
    {pathMatch: 'full', path: 'callback', loadChildren: `${rootPath}/callback/callback.module#CallbackModule`},
    {pathMatch: 'full', path: '**', component: PageNotFoundComponent}
    /*{
        pathMatch: 'full',
        path: 'task',
        canActivate: [AuthGuard],
        loadChildren: `${rootPath}/task/task.module#TaskModule`,
        data: {taskBar: true}
    },*/
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
