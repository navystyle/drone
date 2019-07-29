import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

declare const $: any;

@Component({
    selector: 'app-ui-select',
    template: `
        <select class="ui fluid dropdown" [attr.multiple]="multiple ? '' : null" [ngClass]="{'search': search}">
            <option value="" *ngIf="placeholder">{{placeholder}}</option>
            <ng-content></ng-content>
        </select>
    `,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: UiSelectComponent, multi: true}
    ],
})
export class UiSelectComponent implements ControlValueAccessor, AfterViewInit {

    @Input() placeholder?: string;
    @Input() multiple?: boolean;
    @Input() search?: boolean;

    options: any;
    $element: any;
    defaults: any = {
        onChange: (value: any, text: string, $choice: any) => {
            this.value = this.replaceValueGetter(value);
        }
    };
    private changed = new Array<(value: any) => void>();
    private touched = new Array<() => void>();
    private innerValue: any;

    get value(): any {
        return this.innerValue;
    }

    set value(value: any) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.changed.forEach(f => f(value));
        }
    }

    touch(): void {
        this.touched.forEach(f => f());
    }

    writeValue(value: any): void {
        this.innerValue = value;

        if (this.$element) {
            if (this.innerValue) {
                if (!this.isMultiple()) {
                    this.$element.dropdown('set selected', this.replaceValueSetter(this.innerValue));
                } else if (this.isMultiple() && this.innerValue.constructor === Array && this.innerValue.length > 0) {
                    this.$element.dropdown('set exactly', this.replaceValueSetter(this.innerValue));
                } else {
                    this.$element.dropdown('clear');
                }
            } else {
                this.$element.dropdown('clear');
            }
        }
    }

    registerOnChange(fn: any): void {
        this.changed.push(fn);
    }

    registerOnTouched(fn: any): void {
        this.touched.push(fn);
    }

    setDisabledState(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }

    constructor(private element: ElementRef) {
    }

    ngAfterViewInit(): void {
        this.$element = $(this.element.nativeElement.children);
        this.options = Object.assign({}, this.defaults, this.$element.data());

        this.$element.dropdown(this.options);

        if (this.innerValue) {
            setTimeout(() => {
                this.$element.dropdown('set selected', this.replaceValueSetter(this.innerValue));
            }, 1);
        }
    }

    private isMultiple(): boolean {
        return this.$element.is('[multiple]');
    }

    private replaceValueSetter(value: any): any {
        if (this.isMultiple()) {
            if (value) {
                return value.map((val: any) => {
                    return this.$element.find(`option[value$="'${val}'"]`).val();
                });
            } else {
                return [];
            }
        } else {
            return value;
        }
    }

    private replaceValueGetter(value: any): any {
        if (this.isMultiple()) {
            /*if (value) {
                return value.map((val: any) => {
                    return val.match(/[0-9]+: '([\S\s]+)'/)[1];
                });
            } else {
                return [];
            }*/
            if (!value) {
                return [];
            }
        } else {
            return value;
        }
    }

    public show() {
        this.$element.dropdown('show');
    }

    public hide() {
        this.$element.dropdown('hide');
    }

}
