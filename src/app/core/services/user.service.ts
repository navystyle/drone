import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable()
export class UserService extends BaseService {
    apiUrl = `${environment.apiUrl}/users`;

    globalUsers = new BehaviorSubject<User[]>([]);

    setGlobalUsers() {
        return this.getList()
            .pipe(map(users => {
                const globalUsers: User[] = [];
                for (const user of users) {
                    globalUsers.push(new User(user));
                }

                this.globalUsers.next(globalUsers);
            }))
            .toPromise();
    }

    getGlobalUsers() {
        return this.globalUsers.getValue();
    }

    rank(params?: any): Observable<any> {
        return this.getHttp()
            .get(`${environment.apiUrl}/users-rank`, {params})
            .pipe(catchError(this.formatErrors));
    }

    getRank(user: User): Observable<any> {
        return this.getHttp()
            .get(`${this.apiUrl}/${user._id}/rank`)
            .pipe(catchError(this.formatErrors));
    }
}
