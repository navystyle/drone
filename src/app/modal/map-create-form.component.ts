import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MapService} from '../core/services/map.service';
import {ToastService} from '../core/services/toast.service';

@Component({
    selector: 'app-map-create-form',
    templateUrl: './map-create-form.component.html'
})
export class MapCreateFormComponent {

    submitted = false;

    formGroup: FormGroup = this.fb.group({
        'name': ['', Validators.required],
    });

    @Output() success: EventEmitter<any> = new EventEmitter<any>();

    get f() {
        return this.formGroup.controls;
    }

    constructor(private fb: FormBuilder,
                private mapService: MapService,
                private toastService: ToastService) {
    }

    async submit() {
        this.submitted = true;
        if (this.formGroup.valid) {
            try {
                const response = await this.mapService.post(this.formGroup.getRawValue()).toPromise();
                this.success.emit(response);
                this.toastService.success('Success created map!');
            } catch (e) {
                if (e.error && e.error.code === 11000) {
                    this.f.name.setErrors({'incorrect': true});
                }
                throw e;
            }
        }
    }

    reset() {
        this.formGroup.reset();
        this.submitted = false;
    }
}
