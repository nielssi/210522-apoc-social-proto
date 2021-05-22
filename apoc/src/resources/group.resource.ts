import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AppSettings } from "../providers/app-settings";

@Injectable()
export class GroupsResource {

	private serverAddress: string = new AppSettings().API_URL;	// URL to web API
	private inviteUserWithEmailURL: string = this.serverAddress+"/api/invites/";
	private resourceUrl: string = this.serverAddress+"/api/groups/";
	private createGroupURL: string = this.serverAddress+"/api/groups/";
	private usersGroupsURL: string = this.serverAddress+"/api/groups/forUser";
	private inactivateGroupURL: string = this.serverAddress+"/api/groups/"

  constructor(private http: Http){

	}

	getRecommended(user_token) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
				headers.append('Authorization', 'Bearer ' + user_token);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.resourceUrl+'recommended', options)
					.subscribe((data:any) => {
						resolve(data.json());
					}, err => {
						reject(err.json());
					});
    });
	}

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
		console.log('usersGroups: ',user_token);
	    let headers = new Headers({ 'Content-Type': 'application/json' });
			headers.append('Authorization', 'Bearer ' + user_token);
	    let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			return this.http.get(this.usersGroupsURL, options)
				.subscribe(data => {
					console.log('usersGroups:result', data);
					resolve(data.json());
				}, err => {
					console.error(err);
					reject(err.json());
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
		});
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


  query() {
    console.log("running query.");
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.resourceUrl, options)
					.subscribe((data:any) => {
						resolve(data.json());
					}, err => {
						reject(err.json());
					});
    });
  };

  get(_id: string, user_token: any){
    let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + user_token);
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      this.http.get(this.resourceUrl+_id, options)
              .subscribe(data => {
                resolve(data.json());
              }, err => {
                reject(err.json());
              }, () => {

              });
    })
  }

	update(params: any, user_token?: any) {
		console.log("Called update Group with params", params, user_token);
		let body = params;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + user_token);
		let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			return this.http.put(this.resourceUrl+params._id, body, options)
				.subscribe(data => {
					resolve(data.json());
				}, err => {
					reject(err.json());
				});
		});
	}

	joinGroup(group: any, user_token?: any) {
		console.log("Called leaveGroup with params", group, user_token);
		let body = group;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + user_token);
		let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			return this.http.put(this.resourceUrl+'joinGroup', body, options)
				.subscribe(data => {
					resolve(data.json());
				}, err => {
					reject(err.json());
				});
		});
	}

	leaveGroup(group: any, user_token?: any) {
		console.log("Called leaveGroup with params", group, user_token);
		let body = group;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + user_token);
		let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			return this.http.put(this.resourceUrl+'leaveGroup', body, options)
				.subscribe(data => {
					resolve(data.json());
				}, err => {
					reject(err.json());
				});
		});
	}


}
