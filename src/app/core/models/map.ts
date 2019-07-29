export class IMap {
    _id: string;
    name: string;
    createdAt: string;

    constructor(properties?: {}) {
        if (properties) {
            Object.assign(this, properties);
        }
    }
}
