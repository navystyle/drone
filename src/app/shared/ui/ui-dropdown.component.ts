import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';

declare const $: any;

@Component({
    selector: 'app-ui-dropdown',
    template: `
        <ng-content></ng-content>
    `
})
export class UiDropdownComponent implements AfterViewInit {

    @Input() placeholder?: string;

    options: any;
    $element: any;
    defaults: any = {};
    defaultValue: string|string[];

    constructor(private element: ElementRef) {
    }

    ngAfterViewInit(): void {
        this.$element = $(this.element.nativeElement.children);
        this.options = Object.assign({}, this.defaults, this.$element.data());

        this.$element.dropdown(this.options);

        if (this.defaultValue) {
            this.$element.dropdown('set selected', this.defaultValue);
        }
    }

    public setValue(value: string|string[]): void {
        if (this.$element) {
            setTimeout(() => {
                this.$element.dropdown('set selected', value);
            });
        } else {
            this.defaultValue = value;
        }
    }

    public clear() {
        if (this.$element) {
            setTimeout(() => {
                this.$element.dropdown('clear');
            });
        }

        this.defaultValue = null;
    }
}
