import {Injectable, Injector} from '@angular/core';
import {environment} from '../../../environments/environment';
import Auth0Lock from 'auth0-lock';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Auth} from '../models/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable()
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

    auth = new BehaviorSubject<Auth>(null);

    constructor(private jwtHelper: JwtHelperService,
                private injector: Injector,
                private userService: UserService) {
        this.lock.on('authenticated', (authResult: any) => {
            this.getUserInfo(authResult.accessToken)
                .subscribe(
                    profile => {
                        this.userService.getList({'auth0Sub': profile.sub})
                            .subscribe(
                                response => {
                                    this.setAuthTokens(authResult);

                                    this.auth.next(new Auth(Object.assign(profile, {users: response})));

                                    const returnUrl = this.getReturnUrl();
                                    const queryParams = this.getQueryParams();

                                    this.removeReferer();
                                    this.injector.get(Router).navigate([returnUrl], {queryParams: queryParams});
                                },
                                err => {
                                    throw new Error(err);
                                }
                            );
                    },
                    error => {
                        throw new Error(error);
                    }
                );
        });

        this.lock.on('authorization_error', error => {
            console.log('error', error);
            this.logout();
        });
    }

    private getUserInfo(accessToken?: string): Observable<IProfile> {
        return new Observable<IProfile>(observer => {
            const at = accessToken ? accessToken : this.getAccessToken();
            this.lock.getUserInfo(at, (error: any, profile: IProfile): void => {
                error ? observer.error(error) : observer.next(profile);
            });
        });
    }

    renewTokens() {
        this.lock.checkSession({}, (error: any, authResult: any) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setAuthTokens(authResult);
            } else if (error) {
                console.log('error', error);
                this.logout();
            }
        });
    }

    setAuth(): Promise<Auth> {
        return new Observable<Auth>((observer) => {
            // if (!this.isAuthenticated()) {
            //     observer.complete();
            // }
            if (!this.getAccessToken() && !this.getToken()) {
                observer.complete();
            }

            if (this.isExpiredToken()) {
                this.renewTokens();
            }

            this.getUserInfo()
                .subscribe(
                    profile => {
                        this.userService.getList({'auth0Sub': profile.sub})
                            .subscribe(
                                response => {
                                    this.auth.next(new Auth(Object.assign(profile, {users: response})));
                                    observer.complete();
                                },
                                err => {
                                    observer.error(err);
                                }
                            );
                    },
                    error => observer.error(error)
                );
        }).toPromise();
    }

    async getAuth() {
        return await this.auth.getValue();
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    setAuthTokens(authResult: any) {
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
