export class ChatMessage {
    public obj: {}
    constructor(
        public text: string,
        public toUserName: string,
        public fromUserName: string,
        public from: string,
        public to: string,
        public time: Date,
        public userActive: boolean
    ) {
        this.obj = {
            toUserName: this.toUserName,
            fromUserName: this.fromUserName,
            text: this.text,
            from: this.from,
            to: this.to,
            time: this.time,
            userActive: this.userActive
        }
    }
}
