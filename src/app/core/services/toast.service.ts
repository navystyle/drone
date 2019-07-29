import {Injectable} from '@angular/core';

declare const $: any;

@Injectable()
export class ToastService {
    $element: any;
    $errorOption: any = {
        title: '',
        message: '',
        displayTime: 0,
        closeIcon: true,
        showIcon: false,
        position: 'bottom right',
        class: 'error',
        compact: true,
    };
    $successOption: any = {
        class: 'success',
        message: '',
        showProgress: 'bottom',
        position: 'bottom right',
    };

    constructor() {
    }

    private setElement() {
        if (this.$element) {
            return;
        }
        this.$element = $('body');
    }

    apiError(error: any) {
        this.setElement();
        this.$element.toast(Object.assign(this.$errorOption, {
            title: `[api error] ${error.error.name}`,
            message: `${error.message}: ` +
                     `${error.error.message || error.error.errmsg}<br>` +
                     `[URL] ${error.url}`
        }));
    }

    clientError(error: any) {
        this.setElement();
        this.$element.toast(Object.assign(this.$errorOption, {
            title: `[api error] ${error.title}`,
            message: error.stack,
            class: 'warning'
        }));
    }

    success(message: string) {
        this.setElement();
        this.$element.toast(Object.assign(this.$successOption, {
            message: message,
        }));
    }
}
