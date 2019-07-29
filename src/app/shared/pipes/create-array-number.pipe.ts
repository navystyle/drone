import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'createArrayNumber'})
export class CreateArrayNumberPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        const res = [];
        for (let i = 1; i <= value; i++) {
            res.push(i);
        }

        return res;
    }
}
