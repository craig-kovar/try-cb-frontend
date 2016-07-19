import { Component, OnInit } from '@angular/core';
import { Response } from "@angular/http";
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { UtilityService } from '../shared';
import { environment } from "./../../app/";
import { AuthService } from '../shared';
import { TYPEAHEAD_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  directives: [TYPEAHEAD_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    public auth:AuthService;
    public utility:UtilityService;
    public to:string = '';
    public from:string = '';
    public leaves:string = '';
    public returns:string = null;
    public typeaheadLoading:boolean = false;
    public typeaheadNoResults:boolean = false;
    private _cache:any;
    private _prevContext:any;
    public outboundData: any[];
    public inboundData: any[];
    public choosen: any[];

    constructor(auth:AuthService,utility:UtilityService) {
      this.auth=auth;
      this.utility=utility;
      this.choosen=[];
    }

    public getContext():any {
      return this;
    }

    public getToAirport(context:any):Function {
      this._prevContext = context;

      let f:Function = function ():Promise<string[]> {
        let p:Promise<string[]> = new Promise((resolve:Function) => {
          setTimeout(() => {
            context.utility.makeGetRequest(environment.devHost + "/api/airports?search="+ context.to,[])
            .then((result: Response) => {
                let data = UtilityService.extractData(result);
                return resolve(data);
              })
            }, 200);
        });
        return p;
      };
      this._cache = f;
      return this._cache;
    }

    public getFromAirport(context:any):Function {
      this._prevContext = context;
      let f:Function = function ():Promise<string[]> {
        let p:Promise<string[]> = new Promise((resolve:Function) => {
          setTimeout(() => {
            context.utility.makeGetRequest(environment.devHost + "/api/airports?search="  + context.from, [])
            .then((result: Response) => {
                let data = UtilityService.extractData(result);
                return resolve(data);
              })
            }, 200);
        });
        return p;
      };
      this._cache = f;
      return this._cache;
    }

    public changeTypeaheadLoading(e:boolean):void {
      this.typeaheadLoading = e;
    }

    public changeTypeaheadNoResults(e:boolean):void {
      this.typeaheadNoResults = e;
    }

    public typeaheadOnSelect(e:any):void {
      console.log(`Selected value: ${e.item}`);
    }

    public findFlights(from:string, to:string, leaves:string, returns:string):void {
        this.utility.makeGetRequestObs(environment.devHost + "/api/flightPaths",[from, to],"leave="+leaves)
            .map((response: Response) => response.json())
            .subscribe(
                (val: any) => {
                    this.outboundData = val.data;
                },
                (error: any) => {
                    this.outboundData = null;
                    console.log("Error finding outbound flights: " + error);
                }
            );

        if (returns) {
            this.utility.makeGetRequestObs(environment.devHost + "/api/flightPaths",[to, from],"leave=" + returns)
                .map((response: Response) => response.json())
                .subscribe(
                    (val: any) => {
                        this.inboundData = val.data;
                    },
                    (error: any) => {
                        this.inboundData = null;
                        console.log("Error finding inbound flights: " + error);
                    }
                );
        }
    }

    public choose(row: any, date: string): void {
        this.choosen.push(row);
        let cart = this.utility.getCart();
        cart.push({
            "name": row.name,
            "flight": row.flight,
            "price": row.price,
            "date": date + " " + row.utc,
            "sourceairport": row.sourceairport,
            "destinationairport": row.destinationairport
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    public inCart(row: any): boolean {
        return this.choosen.indexOf(row) != -1;
    }

  ngOnInit() {
  }

}
