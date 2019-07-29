import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const setHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (this.authService.isAuthenticated()) {
            // @ts-ignore
            setHeaders['Authorization'] = `Bearer ${this.authService.getToken()}`;
        }

        request = request.clone({
            setHeaders: setHeaders
        });

        return next.handle(request);
    }
}
