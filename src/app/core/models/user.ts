export class User {
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string;

    constructor(properties?: {}) {
        if (properties) {
            Object.assign(this, properties);
        }
    }
}
