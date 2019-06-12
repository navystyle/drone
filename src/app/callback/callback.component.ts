import {Component, OnInit} from '@angular/core';
import {AuthService} from '../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
			   selector: 'app-callback',
			   templateUrl: './callback.component.html'
		   })
export class CallbackComponent implements OnInit {

	constructor(private authService: AuthService,
				private router: Router) {
	}

	async ngOnInit() {
		const client = await this.authService.getAuth0Client();
		console.log(client);
		const result = await client.handleRedirectCallback();
		console.log('result', result);

		const targetRoute =
			result.appState && result.appState.target ? result.appState.target : '';

		this.authService.isAuthenticated.next(await client.isAuthenticated());
		this.authService.profile.next(await client.getUser());
		// this.authService.token.next(await client.getTokenSilently());

		this.router.navigate([targetRoute]);
	}

}
