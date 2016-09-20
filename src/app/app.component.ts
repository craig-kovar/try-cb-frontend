import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared';
import { Http, Request, RequestMethod, Headers } from "@angular/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  router: Router;
  authService: AuthService;
  constructor(router:Router,authService:AuthService){
    this.authService=authService;
    this.router=router;
  }
}
