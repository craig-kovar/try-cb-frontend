import { Component, OnInit, Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthService, IUser, UtilityService } from '../shared';
import { environment } from '../../environments/environment';

@Injectable()
@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
  authService: AuthService;
  user: string;
  error: any;
  booked: Array<any>;
  utility: UtilityService;

  constructor(authService: AuthService, utilityService: UtilityService) {
      this.authService = authService;
      this.utility = utilityService;
  }

  ngOnInit() {
      this.user = this.utility.getUser();

      this.utility.makeGetRequestObs("/api/user", [this.user, "flights"], null, true)
        .map((response: Response) => response.json())
        .subscribe(
        (val) => {
            this.booked = val.data;
            console.log("found booked flights: " + val.data);
        },
        (error: any) => {
            this.booked = null;
            this.error = error;
        }
    );
  }

}
