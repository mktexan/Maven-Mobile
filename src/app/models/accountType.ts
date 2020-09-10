export class AccountType {
    public obj: {}
    constructor(
        public accountType: string,
    ) {
        this.obj = {
            token: this.accountType,
        }
    }
}
