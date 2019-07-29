import {Component, OnInit} from '@angular/core';
import {Event, NavigationStart, Router} from '@angular/router';
import {AuthService} from './core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private router: Router,
                private authService: AuthService) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                if (this.authService.isExpiredToken()) {
                    this.authService.renewTokens();
                }
            }
        });
    }

    ngOnInit() {
    }
}
