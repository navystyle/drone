import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RankingsComponent} from './rankings.component';

const routes: Routes = [
    {
        path: '',
        component: RankingsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RankingsRoutingModule {
}
