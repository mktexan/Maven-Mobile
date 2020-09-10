import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { TranslateProvider } from '../translate/translate.service';
import { Storage } from '@ionic/storage';
import { User } from '../../models';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public user: User;

  constructor(
    private httpClient: HttpClient,
    public storage: Storage,
    public translate: TranslateProvider
  ) { }

  // Get the userData from Firestore of the logged in user on Firebase.
  public getUserData(): User {
    return this.user;
  }

  public setUserData(socialUser) {
    this.user = socialUser;
  }

  public getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((token) => {
        this.storage.get('userEmail').then((email) => {
          this.httpClient.post('https://homesec.ngrok.io/mobile/getUser', {
            data: { "email": email, 'token': token }
          }).pipe(
            map((res: User) => {
              this.user = res['user'];
              resolve(res)
            }),
            catchError(err => {
              console.log(err)
              reject(err)
              return throwError(err)
            })
          ).subscribe()
        })

      })
    })
  }

  // Change password of the logged in user on Firebase.
  public changePassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {

    })
  }

  // Reset password of the logged in user on Firebase.
  public resetPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {

    })
  }

  // Login to Firebase using email and password combination.
  public loginWithEmail(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {

    })
  }

  // Register an account on Firebase with email and password combination.
  public registerWithEmail(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {

    })
  }

  // Log the user out from Firebase.
  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.remove('uid')
      this.storage.remove('userEmail')
      this.storage.remove('firstName')
      this.storage.remove('lastName')
      this.storage.remove('userName')
      resolve()
    })
  }
}
