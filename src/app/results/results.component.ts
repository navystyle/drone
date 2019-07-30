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
    total: number;
    finish = false;
    filters: any = {};

    loading = false;

    constructor(public authService: AuthService,
                private resultService: ResultService) {
    }

    async ngOnInit() {
        this.authService.auth.subscribe(auth => {
            this.auth = new Auth(auth);
        });

        await this.load();
    }

    private async load() {
        this.loading = true;

        try {
            await this.loadResults();
            this.loading = false;

        } catch (e) {
            this.loading = false;
            throw e;
        }
    }

    async init(params?: any) {
        this.results = [];
        this.page = 1;
        this.filters = params;
        await this.load();
    }

    async loadResults() {
        try {
            this.filters = this.serialize(this.filters);
            this.filters.page = this.page;
            this.filters.limit = this.limit;

            const response = await this.resultService.getList(this.filters).toPromise();
            for (const result of response.items) {
                this.results.push(new Result(result));
            }
            this.finish = response.finish;
            this.total = response.total;
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async more() {
        this.page++;
        await this.load();
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
