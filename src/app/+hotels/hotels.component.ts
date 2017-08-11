import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Response } from "@angular/http";
import { UtilityService } from "../shared/utility.service";
import { Narration, NarrationService } from "../shared/narration.service";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-hotels',
  templateUrl: 'hotels.component.html'
})

@Injectable()

export class HotelsComponent implements OnInit {

  hotelForm: FormGroup;
  utility: UtilityService;
  private _narrations: NarrationService;
  data;
  error;

  constructor(fb: FormBuilder, utility: UtilityService, narrationService: NarrationService) {
    this.hotelForm = fb.group({
       'description': [''],
       'location':  ['']
    });
    this.utility = utility;
    this._narrations = narrationService;
  }

  ngOnInit() { }

  findHotels(value: any): void {
      var location = value.location;
      var description = value.description;

      var url = "/api/hotel/";
      var hasDescription = (description != null && description != "");
      var hasLocation = (location != null && location != "");
      if (hasDescription && hasLocation) {
          url = url + description + "/" + location + "/";
      } else if (hasLocation) {
          url = url + "*/" + location + "/";
      } else if (hasDescription) {
          url = url + description + "/"
      }

      this._narrations.addSeparator("HOTEL: Find Hotels");
      this._narrations.add("GET to " + url, "");

    this.utility.makeGetRequestObs(url, [])
    .map((response: Response) => response.json())
    .subscribe(
        (val: any) => {
            this.data = val.data;
            this.error = null;

            //we expect 2 context requests
            if (val.context.length == 2) {
                this._narrations.addPre("FTS query executed in the backend", "The following FTS query was executed in the backend:", val.context[0]);
                this._narrations.addPre("Subdocument query executed in the backend", "The following subdocument fetch was executed in the backend:", val.context[1]);
                this._narrations.add("SUCCESS", "Found " + this.data.length + " matching hotels");
            } else {
                this._narrations.fallbackPre(2, "SUCCESS (found " + this.data.length + " matching hotels)", val.context);
            }


        },
        (error: any) => {
            this.data = null;
            this.error = error;
            this._narrations.addPre("ERROR", "There was an error:", JSON.stringify(this.error, null, 2));
        }
    );
  }
}
