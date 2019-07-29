import {ErrorHandler, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuardService} from './services/auth-guard.service';
import {UserService} from './services/user.service';
import {JwtModule} from '@auth0/angular-jwt';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {MapService} from './services/map.service';
import {ResultService} from './services/result.service';
import {ErrorsHandler} from './errors-handler/errors-handler';
import {ToastService} from './services/toast.service';

@NgModule({
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
        AuthGuardService,
        UserService,
        MapService,
        ResultService,
        ToastService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: ErrorsHandler
        }
    ]
})
export class CoreModule {
}

export function tokenGetter() {
    return localStorage.getItem('token');
}
