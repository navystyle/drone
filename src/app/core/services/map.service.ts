import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class MapService extends BaseService {
    apiUrl = `${environment.apiUrl}/maps`;
}
