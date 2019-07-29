import {Pipe, PipeTransform} from '@angular/core';
import {LABEL_TIER_LIST} from '../../core/models/user';

@Pipe({name: 'findText'})
export class FindTextPipe implements PipeTransform {
    transform(value: string, type: string): any {
        let result: string;
        switch (value && type) {
            case 'tier':
                result = this.findItem(value, LABEL_TIER_LIST);
                break;

            default:
                result = 'unknown';
                break;
        }

        return result;
    }

    private findItem(value: string, items: any[]) {
        const item = items.find((res: any) => {
            return res.Value === value;
        });

        if (item) {
            return item.Text || 'unknown';
        }

        return value;
    }
}
