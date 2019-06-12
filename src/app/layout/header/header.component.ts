import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
	isAuthenticated = false;
	profile: any;

	private auth0Client: Auth0Client;

	constructor(private authService: AuthService) {
	}

	async ngOnInit() {
		// get auth0 client
		this.auth0Client = await this.authService.getAuth0Client();

		// watch isAuthenticated state
		this.authService.isAuthenticated.subscribe(value => {
			this.isAuthenticated = value;
		});

		// watch profile data
		this.authService.profile.subscribe(profile => {
			this.profile = profile;
		});

		console.log('isAuthenticated', this.isAuthenticated);
		console.log('profile', this.profile);
	}

	async login() {
		await this.auth0Client.loginWithRedirect({
			redirect_uri: `${window.location.origin}/callback`
		});
	}

	logout() {
		this.auth0Client.logout();
	}
}
