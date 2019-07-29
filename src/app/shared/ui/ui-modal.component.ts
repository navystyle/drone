declare const $: any;

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

@Component({
    selector: 'app-ui-modal',
    template: `
        <div class="ui modal" [ngClass]="class">
            <i class="close icon"></i>
            <ng-content></ng-content>
            <div class="actions">
                <div class="ui approve green button" *ngIf="!notUseApprove">submit</div>
                <div class="ui cancel button" *ngIf="!notUseClose">close</div>
            </div>
        </div>
    `,
})
export class UiModalComponent implements AfterViewInit, OnDestroy {
    @Output() shown: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() hidden: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() approve: EventEmitter<any> = new EventEmitter<any>();
    @Input() notUseApprove: boolean;
    @Input() notUseClose: boolean;
    @Input() class?: string;

    options: any;
    $element: any;
    defaults: any = {
        observeChanges: true,
        closable: false,
        allowMultiple: true,
        onShow: () => this.shown.next(true),
        onHide: () => this.hidden.emit(true),
        onApprove: () => {
            this.approve.emit(true);
            return false; // If the function returns false the modal will not hide.
        },
    };

    constructor(private element: ElementRef) {}

    ngAfterViewInit(): void {
        this.$element = $(this.element.nativeElement.children);
        this.options = Object.assign({}, this.defaults, this.$element.data());
        this.$element.modal(this.options);
    }

    ngOnDestroy(): void {
        const parent = this.element.nativeElement.parentElement;
        parent.removeChild(this.element.nativeElement);
    }

    show() {
        this.$element.modal('show');
    }

    hide() {
        this.$element.modal('hide');
    }
}
