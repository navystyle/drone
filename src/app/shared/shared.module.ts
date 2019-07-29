import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UiDropdownComponent} from './ui/ui-dropdown.component';
import {UiSelectComponent} from './ui/ui-select.component';
import {UiModalComponent} from './ui/ui-modal.component';
import {ImgTribeDirective} from './directives/img-tribe.directive';
import {CreateArrayNumberPipe} from './pipes/create-array-number.pipe';
import {UiDatepickerComponent} from './ui/ui-datepicker.component';
import {SelectUserComponent} from './components/select-user.component';
import {DateFormatPipe} from './pipes/date-format.pipe';
import {UiProgressComponent} from './ui/ui-progress.component';
import {UiSidebarComponent} from './ui/ui-sidebar.component';
import {FindTextPipe} from './pipes/find-text.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    ],
    declarations: [
        UiDropdownComponent,
        UiSelectComponent,
        UiModalComponent,
        UiDatepickerComponent,
        UiProgressComponent,
        UiSidebarComponent,
        ImgTribeDirective,
        CreateArrayNumberPipe,
        DateFormatPipe,
        FindTextPipe,
        SelectUserComponent,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        UiDropdownComponent,
        UiSelectComponent,
        UiModalComponent,
        UiDatepickerComponent,
        UiProgressComponent,
        UiSidebarComponent,
        SelectUserComponent,
        ImgTribeDirective,
        CreateArrayNumberPipe,
        DateFormatPipe,
        FindTextPipe,
    ],
    providers: [DatePipe]
})
export class SharedModule {
}
