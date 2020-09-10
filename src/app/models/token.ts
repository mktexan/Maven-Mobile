export class Token {
    public obj: {}
    constructor(
        public token: string,
    ) {
        this.obj = {
            token: this.token,
        }
    }
}
