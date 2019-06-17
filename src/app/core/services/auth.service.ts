import {Injectable, Injector} from '@angular/core';
import {environment} from '../../../environments/environment';
import Auth0Lock from 'auth0-lock';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from '../models/user';
import {BehaviorSubject, Observable} from 'rxjs';

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
                scope: 'openid profile'
            }
        },
        autoclose: true,
    };

    lock = new Auth0Lock(
        environment.auth0.clientId,
        environment.auth0.domain,
        this.auth0Options
    );

    user = new BehaviorSubject<User>(null);

    constructor(private jwtHelper: JwtHelperService,
                private injector: Injector) {
        this.lock.on('authenticated', (authResult: any) => {
            this.lock.getUserInfo(authResult.accessToken, (error: any, profile: IProfile) => {
                if (error) {
                    throw new Error(error);
                }

                this.setAuth(authResult);
                this.user.next(new User(profile));

                const returnUrl = this.getReturnUrl();
                const queryParams = this.getQueryParams();
                this.removeReferer();
                this.injector.get(Router).navigate([returnUrl], {queryParams: queryParams});
            });
        });

        this.lock.on('authorization_error', error => {
            console.log('error', error);
            this.logout();
        });
    }

    private getUserInfo(): Observable<IProfile> {
        const userObservable = new Observable<IProfile>(observer => {
            this.lock.getUserInfo(this.getAccessToken(), (error: any, profile: IProfile): void => {
                error ? observer.error(error) : observer.next(profile);
            });
        });

        return userObservable;
    }

    renewTokens() {
        this.lock.checkSession({}, (error: any, authResult: any) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setAuth(authResult);
            } else if (error) {
                console.log('error', error);
                this.logout();
            }
        });
    }

    setUser(): Promise<User> {
        return new Observable<User>((observer) => {
            if (!this.isAuthenticated()) {
                observer.complete();
            }

            this.getUserInfo()
                .subscribe(
                    profile => {
                        this.user.next(new User(profile));
                        // observer.next(this.user);
                        observer.complete();
                    },
                    error => observer.error(error)
                );
        }).toPromise();
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    setAuth(authResult: any) {
        localStorage.setItem('token', authResult.idToken);
        localStorage.setItem('access_token', authResult.accessToken);
    }

    setReferer() {
        const path = this.injector.get(Router).url.split('?')[0];
        const queryParams = this.injector.get(ActivatedRoute).snapshot.queryParams;
        localStorage.setItem('returnUrl', path);
        localStorage.setItem('queryParams', JSON.stringify(queryParams));
    }

    removeReferer() {
        localStorage.removeItem('returnUrl');
        localStorage.removeItem('queryParams');
    }

    getReturnUrl() {
        return localStorage.getItem('returnUrl') || '/main';
    }

    getQueryParams() {
        return JSON.parse(localStorage.getItem('queryParams'));
    }

    login() {
        this.setReferer();
        this.lock.show();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        this.lock.logout({
            returnTo: window.location.origin
        });
    }

    isAuthenticated() {
        return this.getToken() && !this.jwtHelper.isTokenExpired(this.getToken());
    }

    isExpiredToken() {
        return this.getToken() && this.jwtHelper.isTokenExpired(this.getToken());
    }

}

export interface IIdentity {
    connection: string;
    isSocial: boolean;
    provider: string;
    user_id: string;
}

export interface IMetadata {
    [key: string]: any;
}

export interface IProfile {
    // https://auth0.com/docs/user-profile/normalized
    identities: IIdentity[];
    name: string;
    nickname: string;
    picture: string;
    user_id: string;

    app_metadata?: IMetadata;
    clientID: string;
    created_at: string;
    sub: string;
    updated_at: string;
    user_metadata?: IMetadata;

    email: string;
    email_verified: boolean;
}
