import {User} from './user';
import {IMap} from './map';

export class Result {
    _id: string;
    set: any;
    winner: User = new User;
    winnerData: any;
    loser: User = new User;
    loserData: any;
    occurElo: number;
    map: IMap = new IMap;
    memo: string;
    creator: User = new User;
    resultedAt: string;
    createdAt: string;

    constructor(properties?: {}) {
        if (properties) {
            Object.assign(this, properties);
        }

        if (this.winner && this.winner.constructor.name !== 'User') {
            this.winner = new User(this.winner);
        }

        if (this.loser && this.loser.constructor.name !== 'User') {
            this.loser = new User(this.loser);
        }

        if (this.map && this.map.constructor.name !== 'IMap') {
            this.map = new IMap(this.map);
        }

        if (this.creator && this.creator.constructor.name !== 'User') {
            this.creator = new User(this.creator);
        }
    }
}
