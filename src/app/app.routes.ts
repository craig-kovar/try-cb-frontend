import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './+home';
import { LoginComponent } from './+login';
import { UserComponent } from './+user';
import { CartComponent } from './+cart';
import { HotelsComponent } from './+hotels';

import { OnlyLoggedInGuard } from './app.guards.auth';
import { OnlyNotLoggedInGuard } from './app.guards.notlogged';

const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [ OnlyLoggedInGuard]},
    {path: 'home', component: HomeComponent, canActivate: [ OnlyLoggedInGuard]},
    {path: 'login', component: LoginComponent, canActivate: [ OnlyNotLoggedInGuard ]},
    {path: 'user', component: UserComponent, canActivate: [ OnlyLoggedInGuard]},
    {path: 'cart', component: CartComponent, canActivate: [ OnlyLoggedInGuard]},
    {path: 'hotels', component: HotelsComponent, canActivate: [ OnlyLoggedInGuard]}
];

export const routing = RouterModule.forRoot(routes);