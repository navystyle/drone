import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Result} from '../core/models/result';
import {AuthService} from '../core/services/auth.service';

@Component({
    selector: 'app-results-segment',
    templateUrl: './results-segment.component.html'
})
export class ResultsSegmentComponent implements OnInit {

    @Input() result: Result = new Result();
    @Output() deleted: EventEmitter<any> = new EventEmitter<any>();
    shuffleResult: any = {
        left: {
            user: null,
            userData: null,
            result: '',
            direction: ''
        },
        right: {
            user: null,
            userData: null,
            result: '',
            direction: ''
        },
    };

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        if (this.result) {
            const shuffleBox = [];
            shuffleBox.push(this.result.loser.nick, this.result.winner.nick);
            shuffleBox.sort();
            // this.shuffle(shuffleBox);

            shuffleBox.forEach((nick, key) => {
                const target = key === 0 ? this.shuffleResult.left : this.shuffleResult.right;
                if (nick === this.result.winner.nick) {
                    target.user = this.result.winner;
                    target.userData = this.result.winnerData;
                    target.result = 'win';
                    target.direction = 'up';
                } else if (nick === this.result.loser.nick) {
                    target.user = this.result.loser;
                    target.userData = this.result.loserData;
                    target.result = 'lose';
                    target.direction = 'down';
                }
            });
        }
    }

    // random array shuffle
    shuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor((Math.random() * (i + 1)));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    mathElo(data: any) {
        if (data.result === 'lose') {
            return data.userData.lastElo - this.result.occurElo;
        }

        return data.userData.lastElo + this.result.occurElo;
    }

    async delete(result: Result) {
        if (confirm('경기결과를 삭제하면 되돌릴 수 없습니다. 삭제하시겠습니까?\n삭제시 ELO 점수는 경기 직전 데이터로 변경됩니다.')) {
            this.deleted.emit(result);
        }
    }

    get setCurrent() {
        if (!this.result.set.isSet) {
            return 1;
        }

        return this.result.set.current;
    }

    get setTotal() {
        if (!this.result.set.isSet) {
            return 1;
        }

        return this.result.set.total;
    }
}
