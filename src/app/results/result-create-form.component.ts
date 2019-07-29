import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {UserService} from '../core/services/user.service';
import {IMap} from '../core/models/map';
import {MapService} from '../core/services/map.service';
import {ResultService} from '../core/services/result.service';
import {SelectUserComponent} from '../shared/components/select-user.component';
import {MisMatch} from '../core/validators/mis-match.validator';
import {ToastService} from '../core/services/toast.service';

declare const $: any;

@Component({
    selector: 'app-result-create-form',
    templateUrl: './result-create-form.component.html'
})
export class ResultCreateFormComponent implements OnInit {

    @Output() success: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('selectCreator') selectCreator: SelectUserComponent;
    @ViewChild('selectWinner') selectWinner: SelectUserComponent;
    @ViewChild('selectLoser') selectLoser: SelectUserComponent;

    maps: IMap[];
    submitted = false;

    formGroup: FormGroup = this.fb.group({
        'creator': ['', Validators.required],
        'resultedAt': ['', Validators.required],
        'winner': ['', Validators.required],
        'loser': ['', Validators.required],
        'map': ['', Validators.required],
        'set': this.fb.group({
            'isSet': false,
            'total': 0,
            'current': 0,
        }),
        'memo': '',
    }, {
        validator: MisMatch('winner', 'loser')
    });

    get f() {
        return this.formGroup.controls;
    }

    constructor(private fb: FormBuilder,
                private userService: UserService,
                private mapService: MapService,
                private resultService: ResultService,
                private toastService: ToastService) {
        this.formGroup.get('set.isSet').valueChanges.subscribe(value => {
            if (value) {
                this.formGroup.get('set.total').setValue(3);
                this.formGroup.get('set.current').setValue(1);
            } else {
                this.formGroup.get('set.total').setValue(0);
                this.formGroup.get('set.current').setValue(0);
            }
        });
    }

    async ngOnInit() {
        this.initCheckbox();

        try {
            await this.getMaps();
        } catch (e) {
            throw e;
        }
    }

    async getMaps() {
        this.maps = [];
        const maps = await this.mapService.getList().toPromise();
        for (const map of maps) {
            this.maps.push(new IMap(map));
        }
        return Promise.resolve(this.maps);
    }

    setCreator(_id: string) {
        this.formGroup.get('creator').setValue(_id);
    }

    setWinner(_id: string) {
        this.formGroup.get('winner').setValue(_id);
    }

    setLoser(_id: string) {
        this.formGroup.get('loser').setValue(_id);
    }

    reset() {
        this.selectCreator.reset();
        this.selectWinner.reset();
        this.selectLoser.reset();
        this.formGroup.reset();
        this.submitted = false;
    }

    async setMap() {
        await this.getMaps();
    }

    async submit() {
        this.submitted = true;
        if (this.formGroup.valid) {
            try {
                const response = await this.resultService.post(this.formGroup.getRawValue()).toPromise();
                this.success.emit(response);
                this.toastService.success('Success created result!');
            } catch (e) {
                throw e;
            }
        }
    }

    initCheckbox() {
        $('.ui.checkbox').checkbox();
    }

}
