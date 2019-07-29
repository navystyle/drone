import {AfterViewInit, Component, ElementRef, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel} from '@angular/forms';
import {DatePipe} from '@angular/common';

declare const $: any;

@Component({
    selector: 'app-ui-datepicker',
    template: `
        <div #element class="ui calendar" id="{{calendarId}}">
            <div class="ui left icon input">
                <i class="calendar icon"></i>
                <input placeholder="{{placeholder}}" [(ngModel)]="value">
            </div>
        </div>
    `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: UiDatepickerComponent,
        multi: true,
    }],
})
export class UiDatepickerComponent implements ControlValueAccessor, AfterViewInit {

    @Input() placeholder?: string;
    @Input() settings?: any;
    @Input() calendarId?: string;

    @Input() pickerType = 'date';

    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild(NgModel) model: NgModel;
    @ViewChild('element') element: ElementRef;
    private pickerFormat = 'yyyy-MM-dd';

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

    constructor(private datePipe: DatePipe) {
    }

    ngAfterViewInit(): void {
        const options: {} = Object.assign({
            type: this.pickerType,
            text: {
                days: ['일', '월', '화', '수', '목', '금', '토'],
                months: ['1월 ', '2월 ', '3월 ', '4월 ', '5월 ', '6월 ', '7월 ', '8월 ', '9월 ', '10월 ', '11월 ', '12월 '],
                monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                today: '오늘',
                now: '지금',
                am: '오전',
                pm: '오후'
            },
            formatter: {
                date: (date: Date) => this.datePipe.transform(date, this.pickerFormat)
            },
            onChange: (value: any) => {
                value = this.datePipe.transform(value, this.pickerFormat);

                if (this.value !== value) {
                    this.value = value;
                    this.change.emit(value);
                }
            }
        });

        if (this.settings) {
            if (this.settings.startCalendar) {
                this.settings.startCalendar = $(this.settings.startCalendar);
            }

            if (this.settings.endCalendar) {
                this.settings.endCalendar = $(this.settings.endCalendar);
            }

            const calendarSettings = Object.assign({}, options, this.settings);

            $(this.element.nativeElement).calendar(calendarSettings);
        } else {
            $(this.element.nativeElement).calendar(options);
        }

        if (this.model.control) {
            this.model.control.registerOnChange((value: any) => {
                if (value) {
                    $(this.element.nativeElement).calendar('set date', value);
                } else {
                    $(this.element.nativeElement).calendar('clear');
                }
            });
        }
    }

    registerOnChange(fn: any): void {
        this.changed.push(fn);
    }

    registerOnTouched(fn: any): void {
        this.touched.push(fn);
    }

    writeValue(value: any): void {
        this.innerValue = value;
    }

}
