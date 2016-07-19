import { Component, Injectable, Inject  } from '@angular/core';
import { AuthService, UtilityService } from './';
import { Router, Routes , ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  directives: [ROUTER_DIRECTIVES]
})

export class NavbarComponent {
  authService:AuthService;
  utilityService:UtilityService;
  router:Router;

  constructor(authService:AuthService, utilityService:UtilityService,router:Router) {
    this.authService=authService;
    this.utilityService=utilityService;
    this.router=router;
    if(!this.authService.isAuthenticated()){
      this.router.navigate(["login"]);
    }
  }

  getCost() {
      let cost = 0;
      for (var flight of this.utilityService.getCart()) {
          if (flight.price)
            cost = cost + flight.price;
      }
      return cost;
  }
}
