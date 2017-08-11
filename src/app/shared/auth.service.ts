import { Injectable, Inject } from "@angular/core";
import { Response } from "@angular/http";
import { IUser,IToken } from "./interfaces";
import { UtilityService } from "./utility.service";
import { NarrationService } from "./narration.service";
import { environment } from '../../environments/environment';
import { md5 } from './md5';
import { JwtHelper } from './angular2-jwt';
import { Router } from '@angular/router'


@Injectable()
export class AuthService {

  utility: UtilityService;
  narrationService:NarrationService;
  jwt: JwtHelper;

  constructor(utility: UtilityService, narrationService:NarrationService) {
    this.utility = utility;
    this.narrationService = narrationService;
    this.jwt = new JwtHelper();
  }

  isAuthenticated() {
    if (!localStorage.getItem("user") || localStorage.getItem("user") == "") {
      return false;
    } else {
      return true;
    }
  }

login(email: string, password: string) {
  return new Promise((resolve, reject) => {
    this.utility.makePostRequest("/api/user/login", [], {"user": email, "password": md5(password)}).then((res: Response) => {
      let result = UtilityService.extractData(res);
      if (result.token && environment.jwtEnabled) {
            try {
                let decodedToken = this.jwt.decodeToken(result.token);
                localStorage.setItem("user", decodedToken.user);
                localStorage.setItem("token", result.token);
                resolve();
            } catch (e) {
                reject("Backend created account but returned a malformed token: " + e);
            }
        } else if (result.token) {
            let user = this.jwt.urlBase64Decode(result.token);
            localStorage.setItem("user", user);
            localStorage.setItem("token", result.token);
            resolve();
        } else {
            console.log("DEBUG: login failure, got " + JSON.stringify(result));
            reject("No token found in login response");
        }
    }, (error) => {
      reject(error);
    });
  });
}

register(email: string, password:string) {
  let cUser: IUser = { user: email, password: md5(password) };
  return new Promise((resolve, reject) => {
    this.utility.makePostRequest("/api/user/signup", [], cUser).then((res: Response) => {
      let result = UtilityService.extractData(res);
      let narration = UtilityService.extractNarration(res);
      this.narrationService.addPre("Account Created", "The account for " + email + " was created on the server", narration[0]);
      if (environment.jwtEnabled && result && result.token) {
          try {
              let decodedToken = this.jwt.decodeToken(result.token);
              localStorage.setItem("user", decodedToken.user);
              localStorage.setItem("token", result.token);
              resolve();
          } catch (e) {
              reject("Backend created account but returned a malformed token: " + e);
          }
      } else if (result && result.token) {
          let user = this.jwt.urlBase64Decode(result.token);
          localStorage.setItem("user", user);
          localStorage.setItem("token", result.token);
          resolve();
      } else {
        console.log("DEBUG: registration failure, got " + JSON.stringify(result));
        reject("Registration Failure");
      }
    }, (error) => {
      reject(error);
    });
  });
}

  deAuthenticate() {
    localStorage.clear();
  }
}
