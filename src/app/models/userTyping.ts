export class UserTyping {
    public obj: {}
    constructor(
        public user: string,
        public receivingUser: string,
        public time: Date,
    ) {
        this.obj = {
            user: this.user,
            receivingUser: this.receivingUser,
            time: this.time,
        }
    }
}
