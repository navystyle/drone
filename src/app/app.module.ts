import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule} from './layout/layout.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CoreModule} from './core/core.module';
import {AuthService} from './core/services/auth.service';
import {SharedModule} from './shared/shared.module';
import {UserService} from './core/services/user.service';

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        LayoutModule
    ],
    providers: [
        AuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: init,
            deps: [AuthService, UserService],
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function init(authService: AuthService, userService: UserService): Function {
    // return () => authService.setAuth();
    return () => {
        return Promise.all([authService.setAuth(), userService.setGlobalUsers()]);
    };
    // return () => {};
}
