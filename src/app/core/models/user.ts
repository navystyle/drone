export class User {
    _id: string;
    auth0Sub: string;
    name: string;
    nick: string;
    contact: any;
    tier: string;
    tribe: string;
    description: string;
    elo: number;
    createdAt: string;
    rank: number;
    tierRank: number;
    resultData: any;

    constructor(properties?: {}) {
        if (properties) {
            Object.assign(this, properties);
        }
    }

    getRate(type?: string) {
        const data = this.resultData;
        if (data) {
            if (data.total === 0) {
                return '-';
            }

            if (!type) {
                if (typeof data.win !== 'object') {
                    return Math.round(data.win / data.total * 100) + '%';
                } else {
                    return Math.round(data.win.count / data.total * 100) + '%';
                }
            }

            if (type && (typeof data.win !== 'object' || typeof data.lose !== 'object')) {
                return '-';
            }

            if (type) {
                if (data.win[type] + data.lose[type] === 0) {
                    return '-';
                }

                return Math.round(data.win[type] / (data.win[type] + data.lose[type]) * 100) + '%';
            }
        }

        return '-';
    }
}

export const LABEL_TIER_LIST = [
    {Text: 'Challenger', Value: 'challenger'},
    {Text: 'Major', Value: 'major'},
    {Text: 'Minor', Value: 'minor'},
    {Text: 'Triple', Value: 'triple'},
];

export const LABEL_TRIBE_LIST = [
    {Text: 'Protoss', Value: 'protoss'},
    {Text: 'Terran', Value: 'terran'},
    {Text: 'Zerg', Value: 'zerg'},
];


