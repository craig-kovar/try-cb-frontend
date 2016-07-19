import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { AuthService, IUser, UtilityService } from '../shared';
import { environment } from '../';

@Component({
  moduleId: module.id,
  selector: 'app-cart',
  templateUrl: 'cart.component.html'
})
export class CartComponent implements OnInit {

  authService: AuthService;
  utility: UtilityService;
  error: string;
  added: Array<any>;

  constructor(authService: AuthService, utility: UtilityService) {
      this.authService = authService;
      this.utility = utility;
  }

  ngOnInit() {}

  createFakeBooking() {
      let flight = {
          "username": this.authService.getUser(),
          "flights": [ {
              "name": "Fake Flight",
              "date": "6/23/2016",
              "sourceairport": "CDG",
              "destinationairport": "SFO"
          } ]
      };
      return this.utility.makePostRequest(environment.devHost + "/api/user/flights", [], flight, true).then((response: Response) => {
          let data = UtilityService.extractData(response);
          let narration = UtilityService.extractNarration(response);
          console.log(narration);
          this.added = data.added;
          this.error = null;
      }, (error) => {
          this.added = null;
          this.error = error;
      });
  }

}
