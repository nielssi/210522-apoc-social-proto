import { Injectable } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { Platform } from 'ionic-angular';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AccountService {

  constructor(public platform: Platform) {

  }

  public remember(loginData): Function {
    if (this.platform.is('core')) {
      return this.rememberOnBrowser(loginData);
    } else{
      return this.rememberOnDevice(loginData);
    }
  }

  private rememberOnBrowser(loginData): any {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }

  private rememberOnDevice(loginData): any {
    return new Promise((resolve, reject) => {
  		// console.log("called rememberOnDevice() loginData", loginData.email, loginData.password);
  		//Set user account info
      NativeStorage.setItem('loginData', {email: loginData.email, password: loginData.password})
        .then(
          () => {
            NativeStorage.getItem('loginData')
              .then(
                data => {
                  // console.log(data);
                  //Get user account info
              		var storedData = data;
              		console.log("storedData", storedData.email, storedData.password);
              		if(storedData.email || storedData.password ) {
              		  resolve(storedData);
              		}else{
              		  reject({error:true, message: "Unable to retrieve storedData"});
              		}

                },
                error => console.error(error)
              );
          },
          error => console.error('Error storing item', error)
        );
  	});
  }


  public getStoredData(){
    console.log("getStoredData")
  	return new Promise((resolve, reject) => {
      NativeStorage.getItem('loginData')
        .then(
          data => {
            // console.log(data);
            //Get user account info
            var storedData = data;
            console.log("storedData");
            console.log(storedData.email);
            console.log(storedData.password);

        		if(storedData.email && storedData.password) {
        		  resolve(storedData);
        		}else{
        		  reject({error:true, message: "Unable to retrieve storedData"});
        		}
          },
          (error) => {
            console.log("NativeStorage Error:")
            console.error(JSON.stringify(error))
            reject(error)
          })
  	});
  }

  public completeWalkthrough(){
  	//Set local storage variable
  	return new Promise((resolve, reject) => {
      NativeStorage.setItem('didWalkthrough', true)
        .then(
          () => {
            console.log("set didWalkthrough");
            resolve({status: 'success', didComplete: true});
          }, err => {
            reject(err);
          });
  	});
  }

  public didCompleteWalkthrough(){
    return new Promise((resolve, reject) => {
      //Check if didWalkthrough is set
      if (this.platform.is('core')) {
        // console.log('is Browser, Skipping Walkthrough');
      } else{
        // console.log('is Device');
        NativeStorage.getItem('didWalkthrough')
        .then(res => {
          console.log(res);
          resolve({didComplete: res});
        })
        .catch(err => {
          console.error(err);
          if(err.code == 2){
            // Variable has not been set
            resolve({didComplete: false, error: err});
          }else{
            reject({didComplete: false, error: err});
          }
        });
      }
    })
  }

  public updateShakePreference(pref: any) {
    return new Promise((resolve, reject) => {
  		//Set user account info
      NativeStorage.setItem('preferences.shakeForRandom', pref)
        .then(
          () => {
            NativeStorage.getItem('preferences.shakeForRandom')
              .then(
                data => {
                  console.log(data);
                  //Get user account info
              		var storedData = data;
            		  resolve(storedData);

                },
                error => reject(error)
              );
          },
          error => console.error('Error storing item', error)
        );
  	});
  }

  public getShakePreference() {
    return new Promise((resolve, reject) => {
  		//Set user account info
      NativeStorage.getItem('preferences.shakeForRandom')
        .then(
          data => {
            console.log(data);
            //Get user account info
        		var storedData = data;
      		  resolve(storedData);
          },
          error => reject(error)
        );
  	});
  }


  public forget(){
    return new Promise((resolve, reject) => {
      NativeStorage.setItem('loginData', false)
        .then(
          () => {
            console.log('Account has been forgotten');
            resolve({status: 'success'});
          }, err => {
            reject(err);
          });
  	});
  }
}
