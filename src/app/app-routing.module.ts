import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MainModule} from './layout/main/main.module';

const routes: Routes = [
    {pathMatch: 'full', path: '', redirectTo: 'main'},
    {pathMatch: 'full', path: 'main', loadChildren: './layout/main/main.module#MainModule'},
    // {pathMatch: 'full', path: 'main', loadChildren: () => MainModule},
    {pathMatch: 'full', path: 'callback', loadChildren: './callback/callback.module#CallbackModule'},
    {pathMatch: 'full', path: 'users', loadChildren: './users/users.module#UsersModule'},
    {pathMatch: 'full', path: 'results', loadChildren: './results/results.module#ResultsModule'},
    {pathMatch: 'full', path: 'rankings', loadChildren: './rankings/rankings.module#RankingsModule'},
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
