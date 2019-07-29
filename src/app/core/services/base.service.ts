import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';

@Injectable()
export abstract class BaseService {
    abstract apiUrl = '';

    constructor(private http: HttpClient) {
    }

    formatErrors = (error: any) => throwError(error);
    
    getHttp() {
        return this.http;
    }

    getList(params?: any): Observable<any> {
        return this.http
            .get(this.apiUrl, {params})
            .pipe(catchError(this.formatErrors));
    }

    get(_id: string): Observable<any> {
        return this.http
            .get(`${this.apiUrl}/${_id}`)
            .pipe(catchError(this.formatErrors));
    }

    update(item: any): Observable<any> {
        return this.http
            .put(`${this.apiUrl}/${item['_id']}`, JSON.stringify(item))
            .pipe(catchError(this.formatErrors));
    }

    post(item: any): Observable<any> {
        return this.http
            .post(this.apiUrl, JSON.stringify(item))
            .pipe(catchError(this.formatErrors));
    }

    delete(item: any): Observable<any> {
        return this.http
            .delete(`${this.apiUrl}/${item['_id']}`)
            .pipe(catchError(this.formatErrors));
    }
}
