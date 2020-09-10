export class UserName {
    public obj: {}
    constructor(
        public userName: string,
    ) {
        this.obj = {
            userName: this.userName,
        }
    }
}
