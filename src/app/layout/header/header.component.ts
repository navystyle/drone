import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Auth} from '../../core/models/auth';
import {User} from '../../core/models/user';
import {UserService} from '../../core/services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    auth: Auth;
    globalUsers: User[] = [];

    constructor(public authService: AuthService,
                private userService: UserService) {
    }

    async ngOnInit() {
        this.authService.auth.subscribe(auth => {
            this.auth = new Auth(auth);
        });

        this.globalUsers = this.userService.getGlobalUsers();
    }

    setUser(user: User) {
        this.auth.users.push(user);
        this.globalUsers.push(new User(user));
    }

    async deleteUser(user: User, index: number) {
        if (confirm('Are you sure?')) {
            try {
                await this.userService.delete(user).toPromise();
                this.auth.users.splice(index, 1);

                const getIndex = (users: User[], removeUser: User) => {
                    return users.findIndex(row => row._id === removeUser._id);
                };

                this.globalUsers.splice(getIndex(this.globalUsers, user), 1);
            } catch (e) {
                throw e;
            }
        } else {
            return false;
        }
    }
}
