import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';
import {Router} from '@angular/router';
import {pairwise} from 'rxjs/operators';

declare const $: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: '[app-ui-sidebar]',
    template: `
        <ng-content></ng-content>
    `
})
export class UiSidebarComponent implements AfterViewInit {
    @Input() autoClosable ? = true;

    options: any;
    $element: any;

    constructor(private element: ElementRef, private router: Router) {
    }

    ngAfterViewInit(): void {
        this.$element = $(this.element.nativeElement);
        this.options = Object.assign({}, this.$element.data());

        this.$element.sidebar(this.options);

        if (this.autoClosable) {
            this.router.events.pipe(pairwise()).subscribe(() => {
                this.$element.sidebar('hide');
            });
        }
    }
}
