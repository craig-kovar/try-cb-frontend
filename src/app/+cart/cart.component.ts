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
  cart: Array<any>;

  constructor(authService: AuthService, utility: UtilityService) {
      this.authService = authService;
      this.utility = utility;
      this.cart = utility.getCart();
  }

  ngOnInit() {}

  createFakeBooking() {
      let fake = {
          "name": "Fake Flight",
          "date": "6/23/2016 11:11:11",
          "sourceairport": "CDG",
          "destinationairport": "SFO"
      };
      this.cart = this.utility.getCart();
      this.cart.push(fake);
      localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  book(flight: any) {
      let flights = {
        "flights": [ flight ]
      };
      let user:string = this.utility.getUser();
      return this.utility.makePostRequest(environment.devHost + "/api/user/", [user, "flights"], flights, true).then((response: Response) => {
          let data = UtilityService.extractData(response);
          let narration = UtilityService.extractNarration(response);
          console.log(narration);
          remove(flight);
          this.added = data.added;
          this.error = null;
      }, (error) => {
          this.added = null;
          this.error = error;
      });
  }

  remove(flight: any) {
      this.cart.splice(this.cart.indexOf(flight), 1);
      localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  clearCart() {
      this.cart = [];
      localStorage.setItem("cart", JSON.stringify(this.cart));
  }

}
