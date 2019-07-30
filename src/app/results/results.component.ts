import {Component, OnInit} from '@angular/core';
import {AuthService} from '../core/services/auth.service';
import {Auth} from '../core/models/auth';
import {Result} from '../core/models/result';
import {ResultService} from '../core/services/result.service';

declare const $: any;

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit {
    auth: Auth = new Auth;
    results: Result[] = [];

    page = 1;
    limit = 10;
    finish = false;

    loading = false;

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
            params.page = this.page;
            params.limit = this.limit;

            const response = await this.resultService.getList(params).toPromise();
            for (const result of response.items) {
                this.results.push(new Result(result));
            }
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async more() {
        // todo infinity scroll 구현
        console.log('more');
    }

    serialize(obj: any = {}) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                obj[key] = JSON.stringify(obj[key]);
            }
        });

        return obj;
    }
}
