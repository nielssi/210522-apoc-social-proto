import { Headers, RequestOptions } from '@angular/http';
import { Resource, ResourceParams } from 'ng2-resource-rest';
import { Injectable } from "@angular/core";
import { AppSettings } from "../../app-settings";

export interface IQueryInput {
  page?: number;
  perPage?: number;
  dateFrom?: string;
  dateTo?: string;
  isRead?: string;
}

export interface IActivityShort {
  _id: string;
}

export interface IActivityFull extends IActivityShort {

}

@Injectable()
@ResourceParams({
    url: new AppSettings().API_PATH,		// API_PATH to api
    path: '/activitys/{id}'			// Api path
})

export class Activity extends Resource{
  private serverAddress = new AppSettings().API_URL;	// URL to web API
  private usersActivityURL = this.serverAddress+"/api/activitys/forUser";

  usersActivity(user_token){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + user_token);
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      return this.http.get(this.usersActivityURL, options)
        .subscribe(data => {
          resolve(data.json());
        }, err => {
          reject(err.json());
        });
    })
  }
}
