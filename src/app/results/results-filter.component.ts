import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {IMap} from '../core/models/map';
import {MapService} from '../core/services/map.service';
import {SelectUserComponent} from '../shared/components/select-user.component';
import {LABEL_TIER_LIST} from '../core/models/user';

@Component({
    selector: 'app-results-filter',
    templateUrl: './results-filter.component.html'
})
export class ResultsFilterComponent implements OnInit {

    @Output() success: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('selectUser') selectUser: SelectUserComponent;
    maps: IMap[];
    LABEL_TIER_LIST = LABEL_TIER_LIST;

    formGroup: FormGroup = this.fb.group({
        'user': '',
        'startResultedAt': '',
        'endResultedAt': '',
        'map': '',
        'tier': this.fb.group({
            'challenger': '',
            'major': '',
            'minor': '',
            'triple': '',
        }),
    });

    constructor(private fb: FormBuilder,
                private mapService: MapService) {
    }

    async ngOnInit() {
        try {
            await this.getMaps();
        } catch (e) {
            throw e;
        }
    }

    setUser(_id: string) {
        this.formGroup.get('user').setValue(_id);
    }

    async getMaps() {
        this.maps = [];
        const maps = await this.mapService.getList().toPromise();
        for (const map of maps) {
            this.maps.push(new IMap(map));
        }
        return Promise.resolve(this.maps);
    }

    reset() {
        this.selectUser.reset();
        this.formGroup.reset();
    }

    submit() {
        const params = Object.assign(this.formGroup.getRawValue());
        this.cleanObject(params);
        this.success.emit(params);
    }

    cleanObject(obj: any) {
        Object.keys(obj).forEach((v) => {
            if (!obj.hasOwnProperty(v)) {
                return;
            }

            if (typeof obj[v] === 'object' && obj[v] !== null) {
                this.cleanObject(obj[v]);
            }

            if (!obj[v] || (typeof obj[v] === 'object' && Object.keys(obj[v]).length === 0)) {
                delete obj[v];
            }
        });
    }
}
