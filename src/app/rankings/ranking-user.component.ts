import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {User} from '../core/models/user';
import {UserService} from '../core/services/user.service';

@Component({
    selector: 'app-ranking-user',
    templateUrl: './ranking-user.component.html'
})
export class RankingUserComponent implements OnChanges {
    @Input('user') defaultUser: User;
    user: User = new User;
    loading = false;

    constructor(private userService: UserService) {
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.defaultUser) {
            await this.loadDetail();
        }
    }

    async loadDetail() {
        if (this.defaultUser._id) {
            this.loading = true;
            try {
                const user = await this.userService.getRank(this.defaultUser).toPromise();
                this.user = new User(user);
                this.loading = false;
            } catch (e) {
                this.loading = false;
                throw e;
            }
        }
    }
}
