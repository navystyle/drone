import {Directive, HostBinding, Input, OnChanges} from '@angular/core';

@Directive({
    selector: '[appImgTribe]'
})
export class ImgTribeDirective implements OnChanges {
    @HostBinding('src') imgSrc = '/assets/img/random.png';

    @Input() tribe: string;

    ngOnChanges(): void {
        if (this.tribe) {
            this.imgSrc = `/assets/img/${this.tribe}.png`;
        }
    }
}
