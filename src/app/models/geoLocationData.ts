export class GeoLocationData {
    public obj: {};
    constructor(
      public administrativeArea: string,
      public areasOfInterest: [],
      public countryCode: string,
      public countryName: string,
      public locality: string,
      public postalCode: string,
      public subAdministrativeArea: string,
      public subThoroughfare: string,
      public thoroughfare: string
    ) {
      this.obj = {
        administrativeArea: this.administrativeArea,
        areasOfInterest: this.areasOfInterest,
        countryCode: this.countryCode,
        countryName: this.countryName,
        locality: this.locality,
        postalCode: this.postalCode,
        subAdministrativeArea: this.subAdministrativeArea,
        subThoroughfare: this.subThoroughfare,
        thoroughfare: this.thoroughfare
      };
    }
  }
  