import {ErrorHandler, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../services/toast.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    constructor(private toastService: ToastService) {
    }

    handleError(error: any | HttpErrorResponse) {
        const clonedError = {...error};
        let e = clonedError.rejection;
        if (clonedError.rejection instanceof HttpErrorResponse) {
            /*
            e.error =>
                kind: "ObjectId"
                message: "Cast to ObjectId failed for value "abc" at path "_id" for model "User""
                name: "CastError"
                path: "_id"
                stringValue: ""abc""
                value: "abc"
            */

            // api http error.
            console.error(
                `Backend returned message [${e.status}]${e.message}, ` +
                `body was: ${JSON.stringify(e.error)}`);

            this.toastService.apiError(e);

        } else {
            /*
            e =>
                message: "x is not defined"
                stack: "ReferenceError: x is not defined↵    at MainComponent.<anonymous> (http://localhost:4200...
            */

            // client or network error.
            if (e === undefined) {
                e = {
                    title: 'TypeError',
                    stack: error
                };
            }
            console.error('An error occurred:', e.stack);
            this.toastService.clientError(e);
        }
        // 사용자가 이해할 수 있는 에러 메시지를 반환합니다.
        // return throwError(
        //     'Something bad happened; please try again later.');
    }
}
