import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResultsRoutingModule} from './results-routing.module';
import {ResultsComponent} from './results.component';
import {ResultCreateFormComponent} from './result-create-form.component';
import {SharedModule} from '../shared/shared.module';
import {MapCreateFormComponent} from '../modal/map-create-form.component';
import { ResultsSegmentComponent } from './results-segment.component';
import { ResultsFilterComponent } from './results-filter.component';

@NgModule({
    declarations: [ResultsComponent, ResultCreateFormComponent, MapCreateFormComponent, ResultsSegmentComponent, ResultsFilterComponent],
    imports: [
        CommonModule,
        ResultsRoutingModule,
        SharedModule,
    ]
})
export class ResultsModule {
}
