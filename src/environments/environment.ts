import { CameraOptions } from '@ionic-native/camera/ngx';

export const environment = {
  scrollAssist: false,
  autoFocusAssist: false,
  production: false,
  baseUrl: 'https://maven-api.com/',
  socketUrl: 'wss://maven-api.com?token=',
  auth: 'auth/',
  modifyAccountType: 'modifyUserAccountType',
  getUserOnlineStatus: 'getUserOnlineStatus',
  searchUsersByEmail: 'searchUsersByEmail',
  getAccountTypeUrl: 'getAccountType',
  saveProfilePicture: 'saveUserProfilePicture',
  getUserNameByEmail: 'getUserNameByEmail',
  addPortfolioImage: 'addPortfolioImage',
  getPortfolioImages: 'getPortfolioImages',
  removePortfolioImageById: 'removePortfolioImageById',
  updateBiography: 'updateBiography',
  getBiography: 'getBiography',
  removeTag: 'removeTag',
  postJob: 'postJob',
  getTags: 'getTags',
  addTags: 'addTag',
  getMyJobs: 'getMyJobs',
  deleteJob: 'deleteJob',
  searchTagList: 'searchTagList',
  searchJobList: 'searchJobList',
  deleteAccount: 'deleteAccount',
  getLatestChatsByUser: 'getLatestChatsByUser',
  sendChatMessage: 'sendChatMessage',
  searchUsers: 'searchUsers',
  getAccountUrl: 'getAccount',
  register: 'register',
  resetPassword: 'resetPassword',
  getToken: 'getToken',
  language: 'en',
  oneSignalAppId: '66312d17-b43e-477a-ab25-e4be4b5b7129',
  oneSignalMessageSenderId: '208614709741',
  gcmKey: '',
  googleWebClientId: '',
  googleMapsKey: 'AIzaSyCVdXBkM8ectGE3pSCEP0z1IujBrUqs2d4',
  webToken: '',
  config: {
    autoFocusAssist: false,
    menuType: 'overlay'
  },
  loading: {
    spinner: 'circles',
    duration: 3000
  },
  toast: {
    position: 'bottom',
    duration: 2000
  }
}

export const cameraOptions: CameraOptions = {
  allowEdit: true,
  correctOrientation: true,
  destinationType: 1,
  encodingType: 0,
  mediaType: 0,
  quality: 25,
  targetHeight: 512,
  targetWidth: 512
}
