import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../core/services/auth.service';
import {Auth} from '../core/models/auth';
import {Result} from '../core/models/result';
import {ResultService} from '../core/services/result.service';

declare const $: any;

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, AfterViewInit {
    auth: Auth = new Auth;
    results: Result[] = [];

    innerWidth: number;
    mobileScreenWidth = 767;

    loading = false;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.innerWidth = event.target['innerWidth'];
        this.initSticky();
    }

    constructor(public authService: AuthService,
                private resultService: ResultService) {
    }

    async ngOnInit() {
        this.loading = true;
        this.authService.auth.subscribe(auth => {
            this.auth = new Auth(auth);
        });

        try {
            await this.loadResults();
            this.loading = false;

        } catch (e) {
            this.loading = false;
            throw e;
        }
    }

    async loadResults(params?: any) {
        this.results = [];
        try {
            params = this.serialize(params);
            const response = await this.resultService.getList(params).toPromise();
            for (const result of response) {
                this.results.push(new Result(result));
            }
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    serialize(obj: any = {}) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                obj[key] = JSON.stringify(obj[key]);
            }
        });

        return obj;
    }

    ngAfterViewInit(): void {
        if (!this.innerWidth) {
            this.innerWidth = window.innerWidth;
        }

        this.initSticky();
    }

    initSticky() {
        if (this.innerWidth > this.mobileScreenWidth) {
            $('.ui.sticky').sticky({
                offset: 80,
                context: '#context',
            });
        } else {
            $('.ui.sticky').sticky('destroy');
        }
    }
}
