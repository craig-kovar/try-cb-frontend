import { Component, Injectable, Inject  } from '@angular/core';
import { AuthService } from './auth.service';
import { UtilityService } from './utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent {
  authService:AuthService;
  utilityService:UtilityService;
  router:Router;

  constructor(authService:AuthService, utilityService:UtilityService,router:Router) {
    this.authService=authService;
    this.utilityService=utilityService;
    this.router=router;
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
