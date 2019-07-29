import {User} from './user';

export class Auth {
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string;
    users: User[] = [];

    constructor(properties?: {}) {
        if (properties) {
            Object.assign(this, properties);
        }

        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            if (user && user.constructor.name !== 'User') {
                this.users[i] = new User(user);
            }
        }
    }
}
