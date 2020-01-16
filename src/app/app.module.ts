import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { AuthService,UtilityService, NavbarComponent, NarrationComponent, Narration, NarrationService } from './shared';
import { OnlyLoggedInGuard } from './app.guards.auth';
import { OnlyNotLoggedInGuard } from './app.guards.notlogged';
import { HomeComponent } from './+home';
import { LoginComponent } from './+login';
import { UserComponent } from './+user';
import { CartComponent } from './+cart';
import { HotelsComponent } from './+hotels';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NarrationComponent,
    HomeComponent,
    LoginComponent,
    UserComponent,
    CartComponent,
    HotelsComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    TypeaheadModule
  ],
  providers: [
      AuthService,
      UtilityService,
      NarrationService,
      OnlyLoggedInGuard,
      OnlyNotLoggedInGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
