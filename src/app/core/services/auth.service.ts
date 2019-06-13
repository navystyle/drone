import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import Auth0Lock from 'auth0-lock';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    auth0Options = {
        theme: {
            // logo: '/assets/logo.svg',
            // primaryColor: '#DFA612',
        },
        auth: {
            redirectUrl: environment.auth0.callbackURL,
            responseType: 'token id_token',
            audience: `https://${environment.auth0.domain}/userinfo`,
            params: {
                scope: 'opneid profile'
            }
        },
        autoclose: true,
    };

    lock = new Auth0Lock(
        environment.auth0.clientId,
        environment.auth0.domain,
        this.auth0Options
    );

    constructor(private jwtHelper: JwtHelperService,
                private router: Router) {
        this.lock.on('authenticated', (authResult: any) => {
            this.lock.getUserInfo(authResult.accessToken, (error: any, profile: any) => {
                console.log('profile', profile);
                if (error) {
                    throw new Error(error);
                }

                this.setToken(authResult.idToken);
                this.setProfile(JSON.stringify(profile));
                console.log('it worked!');
                this.router.navigate(['/']);
            });
        });

        this.lock.on('authorization_error', error => {
            console.log('something went wrong', error);
        });
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token: any) {
        localStorage.setItem('token', token);
    }

    async getProfile() {
        // return localStorage.getItem('profile');
    }

    setProfile(profile: any) {
        localStorage.setItem('profile', profile);
    }

    login() {
        this.lock.show();
    }

    logout() {
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
    }

    isAuthenticated() {
        return !this.jwtHelper.isTokenExpired(this.getToken());
    }
}
