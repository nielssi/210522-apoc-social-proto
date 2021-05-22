import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AppSettings } from "../providers/app-settings";

@Injectable()
export class RatingsResource {
  private serverAddress = new AppSettings().API_URL;	// URL to web API
  private resourceURL = this.serverAddress+"/api/ratings/";
  constructor(private http: Http){}

  public get() {
    console.log("get")
  }

  create(params:any, user_token: any){
    console.log("Called create Rating with params", params, user_token);
	    let body = params;
	    let headers = new Headers({ 'Content-Type': 'application/json' });
			headers.append('Authorization', 'Bearer ' + user_token);
	    let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			return this.http.post(this.resourceURL, body, options)
				.subscribe(data => {
					resolve(data.json());
				}, err => {
					reject(err.json());
				}, () => {

				});
		});
  }
}
