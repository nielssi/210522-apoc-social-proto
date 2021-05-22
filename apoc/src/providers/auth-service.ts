import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { ResourceGlobalConfig } from 'ng2-resource-rest';
import { Device } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Subject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// Services
import { AppSettings } from './app-settings';
import { AccountService } from './account-service';

@Injectable()
export class AuthService {
  public device: Device;
  private globalActivityService = new Subject<any>();
  public globalActivityService$ = this.globalActivityService.asObservable();

  constructor(private http: Http, public platform: Platform, public accountSevice: AccountService) {
    this.platform.ready().then(() => {
      this.device = new Device();
    });
  }

	private serverAddress = new AppSettings().API_URL;	// URL to web API
	private signupUrl = this.serverAddress+'/api/users';
	private signinUrl = this.serverAddress+'/auth/local';
	private meUrl = this.serverAddress+'/api/users/me';
  private globalActivityFeedUrl = this.serverAddress+'/api/activitys/';
	private updateUserProfileUrl = this.serverAddress+'/api/users/';
  private followUserUrl = this.serverAddress+'/api/users/followUser';
  private unfollowUserUrl = this.serverAddress+'/api/users/unfollowUser';
	private newPasswordWithTokenUrl = this.serverAddress+"/api/users/requestNewPasswordWithToken";
	private passwordResetUrl = this.serverAddress+"/api/users/requestPasswordReset";
	private logoutUrl = this.serverAddress+"/api/users/logout";

	public Profile: any; 			//The Profile of the currently signed in user
	public jwt: string = '';

  private setProfile(data: any) {
    this.Profile = data;
    this.getGlobalActivityFeed()
    ResourceGlobalConfig.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.jwt
    };
  }

	public storeToken(response){
		// console.log(response);
	}

	public extractData(res: Response) {
		let body = res.json();
		return body || { };
	}

	logout(){
	    let body = {};
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

			return new Promise((resolve, reject) => {
				this.http.post(this.logoutUrl, body, options)
				.subscribe(
					data => {
						resolve(data.json());
					},
					err => {
						reject(err.json())
					}
				);
			});
	}

	requestPasswordReset(data){
	    let body = data;
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			this.http.post(this.passwordResetUrl, body, options)
				.subscribe(
					data => {
						resolve(data.json());
					},
					err => {
					 	reject(err.json())
					}
				);
		})
	}

	requestNewPasswordWithToken(data: any){
		let body = data;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			this.http.post(this.newPasswordWithTokenUrl, body, options)
				.subscribe(
					data => {
						resolve(data.json());
					},
					err => {
					 	reject(err.json())
					}
				);
		})
	}

	submitEmailSignupRequest(signUpData: any){
    let body = signUpData;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
		return new Promise((resolve, reject) => {
	    this.http.post(this.signupUrl, body, options)
			.subscribe(
				data => {
          console.log(data.json());
          this.jwt = data.json().token
          let profile_headers = new Headers({ 'Content-Type': 'application/json' });
          profile_headers.append('Authorization', 'Bearer ' + this.jwt);

          let profile_options = new RequestOptions({ headers: profile_headers });

          this.http.get(this.meUrl, profile_options)
              .subscribe(data => {
                this.setProfile(data.json());
                resolve(data.json());
              }, err => {
                reject(err.json());
              });
				},
				err => {
				 	reject(err.json())
				}
			);
		})
	}

	submitEmailSigninRequest(signInData: any){
		console.log("submitEmailSigninRequest");
		console.log("signin from service.", this.signinUrl, JSON.stringify(signInData));

    let body = signInData;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
		return new Promise((resolve, reject) => {
		    this.http.post(this.signinUrl, body, options)
				.subscribe(
					data => {
						this.jwt = data.json().token
            console.log("TOKEN: "+this.jwt);
						//User exists, fetch the users profile
					  let profile_headers = new Headers({ 'Content-Type': 'application/json' });
						profile_headers.append('Authorization', 'Bearer ' + this.jwt);
					  let profile_options = new RequestOptions({ headers: profile_headers });

						this.http.get(this.meUrl, profile_options)
	  								.subscribe(data => {
                      console.log(data.json())
                      this.setProfile(data.json());

                      resolve(data.json());
	  								}, err => {
                      console.error(err.json())
	  									reject(err.json());
	  								});
					},
					err => {
            console.log(err)
            console.error('ERROR with signinUrl request: ', JSON.stringify(err.json()))
						reject(err.json());
					}
				);
		});
	}

  updateProfilePhoto(url: string) {
    let body = { profile_photo_url: url };
		let headers = new Headers({ 'Content-Type': 'application/json' });
			  headers.append('Authorization', 'Bearer ' + this.jwt);

		let options = new RequestOptions({ headers: headers });
		return new Promise((resolve, reject) => {
			this.http.post(this.updateUserProfileUrl+this.Profile._id+"/updateProfilePhoto", body, options)
				.subscribe(
					data => {
            console.log('Updated Profile: ', data.json());
            let tmpProfiles = data.json();
            this.setProfile(tmpProfiles[0]);
						resolve(data.json());
					},
					err => {
					 	reject(err.json())
					}
				);
		})

  }

	saveUpdatestoProfile(){
		let body = this.Profile;
		let headers = new Headers({ 'Content-Type': 'application/json' });
			  headers.append('Authorization', 'Bearer ' + this.jwt);

		let options = new RequestOptions({ headers: headers });
		return new Promise((resolve, reject) => {
			this.http.post(this.updateUserProfileUrl+this.Profile._id+"/updateProfile", body, options)
				.subscribe(
					data => {
            console.log('Updated Profile: ', data.json());
            let tmpProfiles = data.json();
            this.setProfile(tmpProfiles[0]);
						resolve(data.json());
					},
					err => {
					 	reject(err.json())
					}
				);
		})

	}

  updateProfile(profile: any){
    console.log("updateUser", profile);
    let body = profile;
    let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', 'Bearer ' + this.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post(this.updateUserProfileUrl+this.Profile._id+"/updateProfile", body, options)
        .subscribe(
          data => {
            let tmmProfile = data.json();
            this.setProfile(tmmProfile[0]);
            resolve(data.json());
          },
          err => {
            reject(err.json())
          },
          () => console.log('updateProfile Complete')
        );
    })
  }

  updatePreferences(preferences: any){
    console.log("updateUser", preferences);
    let body = { preferences: preferences };
    let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', 'Bearer ' + this.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post(this.updateUserProfileUrl+this.Profile._id+"/updatePreferences", body, options)
        .subscribe(
          data => {
            let tmmProfile = data.json();
            this.setProfile(tmmProfile[0]);
            resolve(data.json());
          },
          err => {
            reject(err.json())
          });
    })
  }


  followUser(user_id: string) {
    let body = {toFollow: user_id};
    let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', 'Bearer ' + this.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.put(this.followUserUrl, body, options)
        .subscribe(
          data => {
            let tmmProfile = data.json();
            resolve(data.json());
          },
          err => {
            reject(err.json())
          }
        );
    })
  }

  unFollowUser(user_id: string) {
    let body = {toUnFollow: user_id};
    let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', 'Bearer ' + this.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.put(this.unfollowUserUrl, body, options)
        .subscribe(
          data => {
            let tmmProfile = data.json();
            resolve(data.json());
          },
          err => {
            reject(err.json())
          }
        );
    })
  }

  getGlobalActivityFeed(){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.globalActivityFeedUrl, options)
          .subscribe(data => {
            this.globalActivityService.next(data.json())
            resolve(data.json());
          }, err => {
            reject(err.json());
          }, () => console.log("getGlobalActivityFeed complete"));
    });

  }

  addDeviceForPushNotifications(body: any): any {
      var regId = localStorage.getItem('registrationId');
      // Check if ios or android
      console.log(this.device);
      if (this.platform.is('core')) {
        console.log('is Browser');

      } else if(this.platform.is('iOS')){
        console.log('is Device');
          body.apn = regId;

      } else if(this.platform.is('Android')){
          body.gcm = regId;

      }
      body.device = this.device;
      console.log("addDeviceForPushNotifications", JSON.stringify(body), JSON.stringify(this.device), regId);
    return body;
  }

  reloadProfile(){
    let profile_headers = new Headers({ 'Content-Type': 'application/json' });
    profile_headers.append('Authorization', 'Bearer ' + this.jwt);
    let profile_options = new RequestOptions({ headers: profile_headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.meUrl, profile_options)
              .subscribe(data => {
                this.setProfile(data.json());
                console.log(this.Profile);
              }, err => {
                console.error(err.json());
              }, () => console.log("Reload profile complete"));
    });
  }
}
