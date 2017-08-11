import {Observable} from "rxjs/Observable";
import { Component, OnInit } from '@angular/core';
import { Response } from "@angular/http";
import { UtilityService } from '../shared';
import { environment } from '../../environments/environment';
import { AuthService, NarrationService } from '../shared';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    public auth:AuthService;
    public utility:UtilityService;
    narrationService: NarrationService;

    public to:string = '';
    public from:string = '';
    public leaves:string = '';
    public returns:string = null;
    public typeaheadLoading:boolean = false;
    public typeaheadNoResults:boolean = false;
    public outboundData: any[];
    public inboundData: any[];
    public choosen: any[];

    constructor(auth:AuthService,utility:UtilityService, narrationService: NarrationService) {
      this.narrationService = narrationService;
      this.auth=auth;
      this.utility=utility;
      this.choosen=[];
    }

    public getContext():any {
      return this;
    }

    public getToAirport(): Observable<string[]> {
        return this.utility.makeGetRequestObs("/api/airports?search="+ this.to,[])
        .map((result: Response) => {
                let data = UtilityService.extractData(result) as string[];
                let narration = UtilityService.extractNarration(result);
                this.narrationService.addPre("N1QL typeahead for To = "  + this.to, "The following N1QL query was executed on the server:" , narration[0]);
                return data;
              })
        .timeout(500);
    }

    public getFromAirport():Observable<string[]> {
      return this.utility.makeGetRequestObs("/api/airports?search="+ this.from,[])
      .map((result: Response) => {
              let data = UtilityService.extractData(result) as string[];
              let narration = UtilityService.extractNarration(result);
              this.narrationService.addPre("N1QL typeahead for From = "  + this.from, "The following N1QL query was executed on the server:" , narration[0]);
              return data;
            })
      .timeout(500);
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
        let narrationUrl = "/api/flightPaths/" + from + "/" + to + "?leave=" + leaves;
        this.narrationService.addSeparator("HOME: Find Flight");
        this.narrationService.add("Outbound leg GET to " + narrationUrl, "");

        this.utility.makeGetRequestObs("/api/flightPaths",[from, to],"leave="+leaves)
            .map((response: Response) => response.json())
            .subscribe(
                (val: any) => {
                    this.outboundData = val.data;
                    //we expect 2 context requests
                    if (val.context.length == 2) {
                        this.narrationService.addPre("Outbound leg N1QL query 1 executed in the backend", "The following N1QL query was executed in the backend:", val.context[0]);
                        this.narrationService.addPre("Outbound leg N1QL query 2 executed in the backend", "The following N1QL query was executed in the backend:", val.context[1]);
                        this.narrationService.add("Outbound leg SUCCESS", "Found " + val.data.length + " matching outbound flights");
                    } else {
                        this.narrationService.fallbackPre(2, "Outbound leg SUCCESS (found " + val.data.length + " matching outbound flights)", val.context);
                    }
                },
                (error: any) => {
                    this.outboundData = null;
                    this.narrationService.addPre("Outbound leg ERROR", "finding outbound flights: ", JSON.stringify(error));
                }
            );

        if (returns) {
            let narrationUrl = "/api/flightPaths/" + to + "/" + from + "?leave=" + returns;
            this.narrationService.add("Return leg GET to " + narrationUrl, "");

            this.utility.makeGetRequestObs("/api/flightPaths",[to, from],"leave=" + returns)
                .map((response: Response) => response.json())
                .subscribe(
                    (val: any) => {
                        this.inboundData = val.data;
                        //we expect 2 context requests
                        if (val.context.length == 2) {
                            this.narrationService.addPre("Return leg N1QL query 1 executed in the backend", "The following N1QL query was executed in the backend:", val.context[0]);
                            this.narrationService.addPre("Return leg N1QL query 2 executed in the backend", "The following N1QL query was executed in the backend:", val.context[1]);
                            this.narrationService.add("Return leg SUCCESS", "Found " + val.data.length + " matching return flights");
                        } else {
                            this.narrationService.fallbackPre(2, "Return legSUCCESS (found " + val.data.length + " matching return flights)", val.context);
                        }
                    },
                    (error: any) => {
                        this.inboundData = null;
                        this.narrationService.addPre("Return leg ERROR", "finding return flights: ", JSON.stringify(error));
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
