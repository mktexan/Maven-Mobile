export class User {
  public obj: {}
  constructor(
    public password: string,
    public email: string,
    public uid: string,
    public profilePicture: String
  ) {
    this.obj = {
      password: this.password,
      email: this.email,
      uid: this.uid,
      profilePicture: this.profilePicture
    }
  }
}
