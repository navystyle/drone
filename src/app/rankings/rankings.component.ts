import {AfterViewInit, Component, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LABEL_TIER_LIST, User} from '../core/models/user';
import {UserService} from '../core/services/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-rankings',
    templateUrl: './rankings.component.html'
})
export class RankingsComponent implements OnInit, AfterViewInit {
    innerWidth: number;
    mobileScreenWidth = 767;

    @ViewChild('usersRank') usersRank: any;
    LABEL_TIER_LIST = LABEL_TIER_LIST;
    users: User[] = [];
    selectUser: User = new User;
    tier: string;
    loading = false;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.innerWidth = event.target['innerWidth'];
    }

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(async params => {
            try {
                this.tier = params.tier || null;
                const users = await this.loadList(params);
                this.selectUser = users[0] || null;
            } catch (e) {
                throw e;
            }
        });
    }

    ngAfterViewInit(): void {
        if (!this.innerWidth) {
            this.innerWidth = window.innerWidth;
        }
    }

    async loadList(params: any) {
        this.loading = true;
        this.users = [];
        try {
            const response = await this.userService.rank(params).toPromise();
            for (const user of response) {
                this.users.push(new User(user));
            }
            if (!this.users.length) {
                this.renderer.removeClass(this.usersRank.nativeElement, 'nine');
                this.renderer.removeClass(this.usersRank.nativeElement, 'wide');
            } else {
                this.renderer.addClass(this.usersRank.nativeElement, 'nine');
                this.renderer.addClass(this.usersRank.nativeElement, 'wide');
            }

            this.loading = false;
            return Promise.resolve(this.users);
        } catch (e) {
            this.renderer.removeClass(this.usersRank.nativeElement, 'nine');
            this.renderer.removeClass(this.usersRank.nativeElement, 'wide');
            this.loading = false;
            return Promise.reject(e);
        }
    }

}
