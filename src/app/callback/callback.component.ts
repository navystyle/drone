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

    ngOnInit() {
    }

}
