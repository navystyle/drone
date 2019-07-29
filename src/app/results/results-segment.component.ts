import {Component, Input, OnInit} from '@angular/core';
import {Result} from '../core/models/result';
import {User} from '../core/models/user';

@Component({
    selector: 'app-results-segment',
    templateUrl: './results-segment.component.html'
})
export class ResultsSegmentComponent implements OnInit {

    @Input() result: Result = new Result();
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

    constructor() {
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
