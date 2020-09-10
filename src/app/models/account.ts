export class UserAccount {
    public obj: {}
    constructor(
        public accountType: string,
        public email: string,
        public userName: string,
        public uuid: string,
        public profilePicture: string,
        public lastSocketPing: string,
        public online: boolean
    ) {
        this.obj = {
            online: this.online,
            accountType: this.accountType,
            email: this.email,
            userName: this.userName,
            uuid: this.uuid,
            profilePicture: this.profilePicture,
            lastSocketPing: this.lastSocketPing
        }
    }
}
