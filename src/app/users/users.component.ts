import {Component, OnInit} from '@angular/core';
import {UserService} from '../core/services/user.service';
import {User} from '../core/models/user';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

    users: User[] = [];
    loading = false;

    constructor(private userService: UserService) {
    }

    async ngOnInit() {
        this.loading = true;
        this.users = [];
        try {
            const response = await this.userService.getList().toPromise();
            for (const user of response) {
                this.users.push(new User(user));
            }
            this.loading = false;
        } catch (e) {
            this.loading = false;
            throw e;
        }
    }

}
