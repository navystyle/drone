import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {RouterModule} from '@angular/router';
import {UserCreateFormComponent} from '../modal/user-create-form.component';
import {SharedModule} from '../shared/shared.module';
import { SideBarComponent } from './side-bar/side-bar.component';

@NgModule({
    declarations: [HeaderComponent, FooterComponent, UserCreateFormComponent, SideBarComponent],
    exports: [
        HeaderComponent,
        FooterComponent,
        SideBarComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
    ]
})
export class LayoutModule {
}
