import { Injectable, Inject } from "@angular/core";
import { Http, Request, RequestOptions, RequestMethod, Headers, URLSearchParams, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

@Injectable()
export class UtilityService {

    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    makePostRequest(url: string, params: Array<string>, body: Object, authenticate: boolean=false) {
        var fullUrl: string = window.location.protocol + "//" + window.location.host + url;
        if(params && params.length > 0) {
            fullUrl = fullUrl + "/" + params.join("/");
        }
        console.log("DEBUG: POST FULL URL:",fullUrl, " BODY:",JSON.stringify(body));
        return new Promise((resolve, reject) => {
            var requestHeaders = new Headers();
            requestHeaders.append("Content-Type", "application/json");
            if (authenticate) {
                let token = this.getToken();
                if (token) requestHeaders.append('Authorization', 'Bearer ' + token);
            }
            this.http.request(new Request({
                method: RequestMethod.Post,
                url: fullUrl,
                body: JSON.stringify(body),
                headers: requestHeaders
            }))
            .subscribe((success) => {
                console.log("DEBUG: POST RESPONSE:",fullUrl,":",success.json());
                resolve(success);
            }, (error) => {
                reject(error);
            });
        });
    }

    makeGetRequestObs(url: string, params: Array<string>, searchParams?: string, authenticate?: boolean) {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        if (authenticate) {
            let token = this.getToken();
            if (token) headers.append('Authorization', 'Bearer ' + token);
        }
        let options = new RequestOptions({headers: headers});

        var fullUrl: string = url;
        if(params && params.length > 0) {
            fullUrl = fullUrl + "/" + params.join("/");
        }

        if (searchParams) {
            let urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);
            options.search = urlSearchParams;
        }

        console.log("DEBUG: GET FULL URL:",fullUrl);
        return this.http.get(fullUrl, options)
        .do((success) => {
            console.log("DEBUG: GET RESPONSE:",fullUrl,":",success.json());
        },
        (error) => {
                console.log("DEBUG: GET ERROR:",fullUrl,":",error);
            })
        .catch(UtilityService.extractError);
    }

    public static extractData(res: Response): any {
        let body = res.json();
        return body.data || { };
    }

    public static extractNarration(res: Response): any {
        let body = res.json();
        return body.context || [];
    }

    public static extractError(res: Response): Observable<Response> {
        let body = res.json();

        if (body.failure) {
            return Observable.throw(body.failure);
        }
        if (body.message) {
            return Observable.throw(body.message);
        }

        return Observable.throw(body);
    }

    makeGetRequest(url: string, params: Array<string>) {
        let obs = this.makeGetRequestObs(url, params);
        return new Promise((resolve, reject) => {
            obs
            .subscribe((success) => {
                resolve(success);
            }, (error) => {
                reject(error);
            });
        });
    }

    getUser(){
        let user = localStorage.getItem("user");
        if (user) {
            return user;
        }
        return null;
    }

    getToken() {
      let token = localStorage.getItem("token");
      if (token) {
          return token;
      }
      return null;
    }

    getCart() {
        let cart = localStorage.getItem("cart");
        if (cart) {
            return JSON.parse(cart);
        }
        return [];
    }

}
