import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './+home';
import { LoginComponent } from './+login';
import { UserComponent } from './+user';
import { CartComponent } from './+cart';
import { HotelsComponent } from './+hotels';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'user', component: UserComponent},
    {path: 'cart', component: CartComponent},
    {path: 'hotels', component: HotelsComponent}
];

export const routing = RouterModule.forRoot(routes);