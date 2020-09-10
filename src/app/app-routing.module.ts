import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from './guard/auth.guard'

const routes: Routes = [
  { path: '', redirectTo: 'loader', pathMatch: 'full' },
  { path: 'edit-profile', loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule), canActivate: [AuthGuard] },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'job-seeker', loadChildren: () => import('./pages/job-seeker/job-seeker.module').then(m => m.JobSeekerPageModule), canActivate: [AuthGuard] },
  { path: 'individual-chat', loadChildren: () => import('./pages/individual-chat-page/individual-chat.module').then(m => m.IndividualChatPageModule), canActivate: [AuthGuard] },
  { path: 'chat-page', loadChildren: () => import('./pages/chat-page/chat.module').then(m => m.ChatPageModule), canActivate: [AuthGuard] },
  { path: 'business-owner', loadChildren: () => import('./pages/business-owner/business-owner.module').then(m => m.BusinessOwnerPageModule), canActivate: [AuthGuard] },
  { path: 'about-me', loadChildren: () => import('./pages/about-me/about-me.module').then(m => m.AboutMePageModule), canActivate: [AuthGuard] },
  { path: 'about-me', loadChildren: () => import('./pages/about-me/about-me.module').then(m => m.AboutMePageModule), canActivate: [AuthGuard] },
  { path: 'tags', loadChildren: () => import('./pages/tags/tags.module').then(m => m.TagsPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'walkthrough', loadChildren: () => import('./pages/walkthrough/walkthrough.module').then(m => m.WalkthroughPageModule) },
  { path: 'business-setup', loadChildren: () => import('./pages/business-setup/business-setup.module').then(m => m.BusinessSetupPageModule), canActivate: [AuthGuard] },
  { path: 'job-listings', loadChildren: () => import('./pages/job-listings/job-listings.module').then(m => m.JobListingsPageModule), canActivate: [AuthGuard] },
  { path: 'post-job', loadChildren: () => import('./pages/post-job/post-job.module').then(m => m.PostJobPageModule), canActivate: [AuthGuard] },
  { path: 'my-jobs', loadChildren: () => import('./pages/my-jobs/my-jobs.module').then(m => m.MyJobsPageModule), canActivate: [AuthGuard] },
  { path: 'jobs', loadChildren: () => import('./pages/jobs/jobs.page.module').then(m => m.JobsPageModule ), canActivate: [AuthGuard] },
  {
    path: 'create-profile',
    loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfilePageModule),
    canActivate: [AuthGuard]
  },
  { path: 'loader', loadChildren: () => import('./pages/loader/loader/loader.module').then(m => m.LoaderPageModule) }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
