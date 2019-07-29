import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {User} from '../../core/models/user';
import {UserService} from '../../core/services/user.service';
import {AuthService} from '../../core/services/auth.service';
import {Auth} from '../../core/models/auth';
import {UiDropdownComponent} from '../ui/ui-dropdown.component';

@Component({
    selector: 'app-select-user',
    templateUrl: './select-user.component.html'
})
export class SelectUserComponent implements OnInit {
    @Input() type = 'all';
    @Input() default?: boolean;
    @Input() search?: boolean;
    @Output() changed: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('dropdown') dropdown: UiDropdownComponent;

    users: User[];
    results: any;

    constructor(private userService: UserService,
                private authService: AuthService) {
    }

    async ngOnInit() {
        if (this.type === 'all') {
            this.users = await this.userService.getGlobalUsers();
        } else {
            let variableAuth: Auth = new Auth;
            this.authService.auth.subscribe(auth => {
                variableAuth = new Auth(auth);
            });
            this.users = variableAuth.users;
        }

        this.results = this.users.reduce((row, user) => {
            row[user.tier] = row[user.tier] || [];
            row[user.tier].push(user);
            return row;
        }, Object.create(null));

        if (this.default && this.users.length) {
            // todo: users default control
            this.dropdown.setValue(this.users[0]._id);
        }
    }

    onChange(_id: number) {
        this.changed.emit(_id);
    }

    reset() {
        this.dropdown.clear();

        if (this.default) {
            // todo: users default control
            this.dropdown.setValue(this.users[0]._id);
        }
    }
}
