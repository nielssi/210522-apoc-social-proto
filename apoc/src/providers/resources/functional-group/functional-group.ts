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

export interface IGroupShort {
  _id: string;
}

export interface IGroupFull extends IGroupShort {

}

@Injectable()
@ResourceParams({
    url: new AppSettings().API_PATH,		// API_PATH to api
    path: '/groups/{id}'			// Api path
})

export class FunctionalGroup extends Resource{

  	private serverAddress = new AppSettings().API_URL;	// URL to web API
  	private inviteUserWithEmailURL = this.serverAddress+"/api/invites/";
  	private createGroupURL = this.serverAddress+"/api/groups/";
  	private usersGroupsURL = this.serverAddress+"/api/groups/forUser";
  	private inactivateGroupURL = this.serverAddress+"/api/groups/"
  	inviteUserWithEmail(invitee){
  		console.log("did inviteUserWithEmail", invitee);
  	    let body = invitee;
  	    let headers = new Headers({ 'Content-Type': 'application/json' });
  	    let options = new RequestOptions({ headers: headers });

  		return new Promise((resolve, reject) => {
  			return this.http.post(this.inviteUserWithEmailURL, body, options)
  				.subscribe(data => {
  					resolve(data.json());
  				}, err => {
  					reject(err.json());
  				}, () => {

  				});
  		})

  	}

  	usersGroups(user_token){
  	    let headers = new Headers({ 'Content-Type': 'application/json' });
  			headers.append('Authorization', 'Bearer ' + user_token);
  	    let options = new RequestOptions({ headers: headers });

  		return new Promise((resolve, reject) => {
  			return this.http.get(this.usersGroupsURL, options)
  				.subscribe(data => {
  					resolve(data.json());
  				}, err => {
  					reject(err.json());
  				}, () => {

  				});
  		})
  	}

  	create(params:any, user_token){
  		console.log("Called create Group with params", params, user_token);
  	    let body = params;
  	    let headers = new Headers({ 'Content-Type': 'application/json' });
  			headers.append('Authorization', 'Bearer ' + user_token);
  	    let options = new RequestOptions({ headers: headers });

  		return new Promise((resolve, reject) => {
  			return this.http.post(this.createGroupURL, body, options)
  				.subscribe(data => {
  					resolve(data.json());
  				}, err => {
  					reject(err.json());
  				}, () => {

  				});
  		})
  	}

  	inactivateGroup(group:any, user_token){
  	    let body = group;
  	    let headers = new Headers({ 'Content-Type': 'application/json' });
  			headers.append('Authorization', 'Bearer ' + user_token);
  	    let options = new RequestOptions({ headers: headers });

  		return new Promise((resolve, reject) => {
  			return this.http.post(this.inactivateGroupURL+group._id+"/inactivate", body, options)
  				.subscribe(data => {
  					resolve(data.json());
  				}, err => {
  					reject(err.json());
  				}, () => {

  				});
  		})
  	}
}
