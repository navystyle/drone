import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class ResultService extends BaseService {
    apiUrl = `${environment.apiUrl}/results`;
}
