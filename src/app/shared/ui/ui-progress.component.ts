import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';

declare const $: any;

@Component({
    selector: 'app-ui-progress',
    template: `
        <ng-content></ng-content>
    `
})
export class UiProgressComponent implements AfterViewInit {
    @Input() defaults: any = {};

    options: any;
    $element: any;

    constructor(private element: ElementRef) {
    }

    ngAfterViewInit(): void {
        this.$element = $(this.element.nativeElement.children);
        this.options = Object.assign({}, this.defaults, this.$element.data());
        this.$element.progress(this.options);
    }
}
