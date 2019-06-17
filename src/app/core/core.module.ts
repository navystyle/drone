import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {JwtModule} from '@auth0/angular-jwt';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {AuthGuardService} from './services/auth-guard.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter
            }
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        AuthService,
        AuthGuardService,
    ]
})
export class CoreModule {
}

export function tokenGetter() {
    return localStorage.getItem('token');
}
