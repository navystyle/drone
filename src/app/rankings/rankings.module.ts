import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RankingsRoutingModule} from './rankings-routing.module';
import { RankingsComponent } from './rankings.component';
import {SharedModule} from '../shared/shared.module';
import { RankingUserComponent } from './ranking-user.component';

@NgModule({
    declarations: [RankingsComponent, RankingUserComponent],
    imports: [
        CommonModule,
        RankingsRoutingModule,
        SharedModule,
    ]
})
export class RankingsModule {
}
