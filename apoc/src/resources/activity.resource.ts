import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams, Http } from '@angular/http';
import { AppSettings } from "../providers/app-settings";

@Injectable()
export class ActivitiesResource {
  private serverAddress = new AppSettings().API_URL;	// URL to web API
  private resourceURL = this.serverAddress+"/api/activitys/";
  private usersActivityURL = this.serverAddress+"/api/activitys/forUser";
  private usersPublicActivityURL = this.serverAddress+"/api/activitys/usersPublic";
  constructor(private http: Http){}

  public get() {
    console.log("get")
  }

  usersActivity(user_token){
    console.log('userActivity: ', user_token);
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
    });
  }

  usersPublicActivity(user_token, user_id){
    console.log('usersPublicActivity: ', user_token);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + user_token);
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      return this.http.get(this.usersPublicActivityURL + '/' + user_id, options)
        .subscribe(data => {
          resolve(data.json());
        }, err => {
          reject(err.json());
        }, () => {
          console.log("Finished loading usersActivity");
        });
    });
  }

  create(params:any, user_token: any){
    console.log("Called create Activity with params", params, user_token);
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
