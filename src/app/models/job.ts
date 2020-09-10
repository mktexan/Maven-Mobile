export class Job {
    public obj: {}
    constructor(
        public companyName: string,
        public creationDate: Date,
        public description: string,
        public location: string,
        public pay: Number,
        public tags: [],
        public title: string,

    ) {
        this.obj = {
            companyName: this.companyName,
            creationDate: this.creationDate,
            description: this.description,
            location: this.location,
            pay: this.pay,
            tags: this.tags,
            title: this.title
        }
    }
}
