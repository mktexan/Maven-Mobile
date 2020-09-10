import { Injectable } from '@angular/core';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { last } from 'rxjs/operators';
import { GeoLocationData } from 'src/app/models/geoLocationData';

@Injectable({
    providedIn: 'root'
})


export class GpsService {
    constructor(
        private nativeGeocoder: NativeGeocoder,
        private geoLocation: Geolocation) { }
    private getLocationFromGps(latitude: number, longitude: number) {
        return new Promise((resolve, reject) => {
            let options: NativeGeocoderOptions = {
                useLocale: true,
                maxResults: 1
            }
            this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
                .then((result: NativeGeocoderResult[]) => {
                    resolve(result[0])
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public getPosition() {
        return new Promise((resolve, reject) => {
            this.geoLocation.getCurrentPosition().then(async (resp) => {
                this.getLocationFromGps(Number(resp.coords.latitude), Number(resp.coords.longitude)).then((data: GeoLocationData) => {
                    let locality = data.locality + ", " + data.administrativeArea

                    if (data.locality == "") locality = data.administrativeArea

                    return resolve({ locality: locality, lat: resp.coords.latitude, lon: resp.coords.longitude })

                }).catch((error: any) => {
                    console.log(error)
                    return reject(error)
                })

            }).catch((error) => {
                console.log('Error getting location', error)
                return reject(error)
            })
        })
    }
}