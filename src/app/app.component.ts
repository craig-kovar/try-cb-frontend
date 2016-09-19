import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, NarrationService } from './shared';
import { Http, Request, RequestMethod, Headers } from "@angular/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  router: Router;
  authService: AuthService;
  narrationService: NarrationService;

  constructor(router:Router,authService:AuthService, narrationService: NarrationService){
    this.authService=authService;
    this.router=router;
    if(!this.authService.isAuthenticated()){
      this.router.navigate(["login"]);
    }
    this.narrationService = narrationService;
  }
}
