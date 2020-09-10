import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class HelperService {
    public compare(a: any, b: any) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.band.toUpperCase()
        const bandB = b.band.toUpperCase()

        let comparison = 0
        if (bandA > bandB) comparison = 1
        else if (bandA < bandB) comparison = -1
        return comparison
    }
}