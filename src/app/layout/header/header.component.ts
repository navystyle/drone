import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {User} from '../../core/models/user';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    user: User;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.user.subscribe(user => {
            this.user = new User(user);
        });
    }
}
