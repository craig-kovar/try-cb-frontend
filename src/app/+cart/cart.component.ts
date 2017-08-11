import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { AuthService, IUser, UtilityService, NarrationService } from '../shared';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-cart',
  templateUrl: 'cart.component.html'
})
export class CartComponent implements OnInit {

  authService: AuthService;
  utility: UtilityService;
  narrationService: NarrationService;
  error: string;
  added: Array<any>;
  cart: Array<any>;

  constructor(authService: AuthService, utility: UtilityService, narrationService: NarrationService) {
      this.authService = authService;
      this.narrationService = narrationService;
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

      this.narrationService.addSeparator("CART");
      this.narrationService.addPre("Added fake element to cart", "Nothing was transmitted to the server", JSON.stringify(fake));
  }

  book(flight: any) {
      this.narrationService.addSeparator("CART: Booking");
      let flights = {
        "flights": [ flight ]
      };
      let user:string = this.utility.getUser();
      let url:string = "/api/user/" + user + "/flights";
      this.narrationService.addPre("Authenticated POST to " + url, "The payload was:", JSON.stringify(flights));

      return this.utility.makePostRequest(url, [], flights, true).then((response: Response) => {
          let data = UtilityService.extractData(response);
          let narration = UtilityService.extractNarration(response);
          this.remove(flight);
          this.added = data.added;
          this.error = null;

          this.narrationService.add("Booking stored in the backend", narration);
          this.narrationService.add("SUCCESS", "");
      }, (error) => {
          this.added = null;
          this.error = error;
          this.narrationService.addPre("ERROR", "", error);
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
