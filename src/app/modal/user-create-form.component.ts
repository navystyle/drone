import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Auth} from '../core/models/auth';
import {AuthService} from '../core/services/auth.service';
import {UserService} from '../core/services/user.service';
import {LABEL_TIER_LIST, LABEL_TRIBE_LIST, User} from '../core/models/user';
import {ToastService} from '../core/services/toast.service';

@Component({
    selector: 'app-user-create-form',
    templateUrl: './user-create-form.component.html'
})
export class UserCreateFormComponent {

    @Output() success: EventEmitter<any> = new EventEmitter<any>();
    @Output() successUpdate: EventEmitter<any> = new EventEmitter<any>();
    auth: Auth;
    nick: string;
    submitted = false;
    LABEL_TIER_LIST = LABEL_TIER_LIST;
    LABEL_TRIBE_LIST = LABEL_TRIBE_LIST;

    formGroup: FormGroup = this.fb.group({
        '_id': '',
        'auth0Sub': '',
        'name': ['', Validators.required],
        'nick': ['', Validators.required],
        'contact': this.fb.group({
            'battleCode': '',
            'kakaoId': '',
            'phone': '',
        }),
        'tier': ['', Validators.required],
        'tribe': ['', Validators.required],
        'description': ''
    });

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private toastService: ToastService) {
    }

    get f() {
        return this.formGroup.controls;
    }

    setAuth(auth: Auth) {
        this.auth = auth;
        this.formGroup.get('auth0Sub').setValue(this.auth.sub);
    }

    setUser(user: User) {
        this.formGroup.reset(user);
    }

    async submit() {
        this.submitted = true;
        if (this.formGroup.valid) {
            try {
                let response;
                if (this.formGroup.get('_id').value) {
                    response = await this.userService.update(this.formGroup.getRawValue()).toPromise();
                    this.successUpdate.emit(response);
                } else {
                    response = await this.userService.post(this.formGroup.getRawValue()).toPromise();
                    this.success.emit(response);
                }
                this.toastService.success('Success created/updated user!');
            } catch (e) {
                if (e.error && e.error.code === 11000) {
                    this.f.nick.setErrors({'incorrect': true});
                }
                throw e;
            }
        }
    }

    reset() {
        this.formGroup.reset({
            'auth0Sub': this.auth.sub
        });
        this.submitted = false;
    }
}
