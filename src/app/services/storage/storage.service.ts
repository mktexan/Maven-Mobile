import { Injectable, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs';
import { Camera } from '@ionic-native/camera/ngx'
import { File } from '@ionic-native/file/ngx'
import { cameraOptions } from '../../../environments/environment'
import { LoadingService } from '../loading/loading.service'
import { ToastService } from '../toast/toast.service'
import { TranslateProvider } from '../translate/translate.service'
import { Storage } from '@ionic/storage'
import { UserAccount } from 'src/app/models/account'

@Injectable({
  providedIn: 'root'
})

export class StorageService implements OnDestroy {
  profileURL: Promise<any>

  constructor(
    public file: File,
    public storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private translate: TranslateProvider,
    private camera: Camera,
  ) { }

  // Clean up the camera
  ngOnDestroy() {
    this.camera.cleanup()
  }

  public getToken(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getTokenTime(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('tokenExpiration').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getPassword(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('userPassword').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getUserName(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('userName').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getAccountType(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('accountType').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getIntroShown(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('introShown').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setIntroShown(value: boolean): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('introShown', value).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setDeviceWidth(value: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('deviceWidth', value).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getDeviceWidth(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('deviceWidth').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getDeviceHeight(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('deviceHeight').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setDeviceHeight(value: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('deviceHeight', value).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getUserEmail(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('userEmail').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getTargetedChatUser(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('targetedChatUser').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setToken(token: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('token', token).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setUserEmail(email: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('userEmail', email).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setOneSignalId(id: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('oneSignalId', id).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getOneSignalId(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('oneSignalId').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }


  public setOneSignalPushToken(pushToken: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('oneSignaPushToken', pushToken).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getOneSignaPushToken(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('oneSignaPushToken').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getUserBiography(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('userBiography').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }


  public setUserBiography(biography: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('userBiography', biography).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setUserName(userName: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('userName', userName).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setUserPassword(password: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('userPassword', password).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setFailedPortfolioImageRemoval(id: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('failedPortfolioImageRemoval', id).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public removeFailedPortfolioImageRemoval(id: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.remove(id).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setUserUid(uid: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('uid', uid).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setTargetedChatUser(email: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('targetedChatUser', email).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setTokenExpiration(time: Date): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('tokenExpiration', time).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setAccountType(accountType: String): Promise<any> | void {
    console.log(accountType)
    console.log('setting account type')
    return new Promise((resolve, reject) => {
      this.storage.set('accountType', accountType).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setProfilePicture(image: String): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('profilePicture', image).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }


  public addPortfolioPicture(image: String, myId: any): Promise<any> | void {
    return new Promise((resolve, reject) => {
      let data = []
      this.storage.get('portfolioPictures').then((pics: any[]) => {
        if (pics) {
          data = pics
          data.push({ image: image, uuid: myId })
          this.storage.set('portfolioPictures', data).then((val) => {
            resolve(true)
          }).catch(err => {
            reject(err)
          })
        } else {
          data.push({ image: image, uuid: myId })
          this.storage.set('portfolioPictures', data).then((val) => {
            resolve(true)
          }).catch(err => {
            reject(err)
          })
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getPortfolioPictures(): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      this.storage.get('portfolioPictures').then((pics: any[]) => {
        resolve(pics)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public removePortfolioPicture(id: any): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      const images = await this.getPortfolioPictures()
      if (images !== null && images !== undefined) {
        console.log(images)
        const result = images.filter((e) => e.uuid !== id)
        console.log(result)
        this.storage.set('portfolioPictures', result).then((data) => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  public getProfilePicture(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('profilePicture').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getConnectionStatus(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('connectionStatus').then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public setConnectionStatus(status: boolean): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.set('connectionStatus', status).then((val) => {
        resolve(val)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getRecentConversations(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('recentConversations').then((conversations) => {
        resolve(conversations)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getRecentUnreadMail(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('unreadMail').then((mail) => {
        resolve(mail)
      }).catch(err => {
        reject(err)
      })
    })
  }


  public addToUnreadMail(email: any): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      let mail = await this.getRecentUnreadMail()

      if (mail !== null && mail !== undefined && email !== undefined) {
        if (!mail.includes(email)) mail.push(email)
      } else {
        mail = []
        mail.push(email)
      }

      this.storage.set('unreadMail', mail).then((data) => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public getUnreadMailTest(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get('unreadMailUsers').then((mail: UserAccount[]) => {
        resolve(mail)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public addToUnreadMailTest(email: any): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      let mail: UserAccount[]
      const token = await this.getToken()
      const accountType = await this.getAccountType()

      mail = await this.getUnreadMailTest()

      if (mail !== null && mail !== undefined && email !== undefined) {

        // if (!mail.includes(email)) mail.push(email)
        // mail.push(email)
      } else {
        // mail = []
        // mail.push(email)
      }

      // this.storage.set('unreadMailUsers', mail).then((data) => {
      //   resolve(data)
      // }).catch(err => {
      //   reject(err)
      // })
    })
  }

  public removeFromUnreadMail(email: any): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      const mail = await this.getRecentUnreadMail()
      if (mail !== null && mail !== undefined) {
        const result = mail.filter((e: String) => e !== email)
        this.storage.set('unreadMail', result).then((data) => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  public addToRecentConversations(userName: any): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      let conversations = await this.getRecentConversations()

      if (conversations !== null && conversations !== undefined) {
        if (!conversations.includes(userName)) conversations.push(userName)
      } else {
        conversations = []
        conversations.push(userName)
      }

      this.storage.set('recentConversations', conversations).then((data) => {
        resolve(data)
      }).catch(err => {
        reject()
      })
    })
  }

  public setRecentConversationsFullUser(user: any): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      const previousUsers = await this.getRecentCoversationsFullUser()

      if (previousUsers !== null && previousUsers !== undefined) {
        let newUserList = []

        previousUsers.forEach(element => {
          newUserList.push(element)
        })

        newUserList.push(user[0])

        this.storage.set('recentConversationsFullUser', newUserList).then((data) => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      } else {
        this.storage.set('recentConversationsFullUser', user).then((data) => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  public getRecentCoversationsFullUser(): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      this.storage.get('recentConversationsFullUser').then((users: any) => {
        resolve(users)
      }).catch(err => {
        reject(err)
      })
    })
  }

  public removeFromRecentConversations(userName: String): Promise<any> | void {
    return new Promise(async (resolve, reject) => {
      const conversations = await this.getRecentConversations()
      if (conversations !== null && conversations !== undefined) {
        const result = conversations.filter((e: String) => e !== userName)
        this.storage.set('recentConversations', result).then((data) => {
          resolve(data)
        }).catch(err => {
          reject()
        })
      }
    })
  }


  // Append the current date as string to the file name.
  private appendDateString(fileName: string): string {
    const name = fileName.substr(0, fileName.lastIndexOf('.')) + '_' + Date.now()
    const extension = fileName.substr(fileName.lastIndexOf('.'), fileName.length)
    return name + '' + extension;
  }
}

