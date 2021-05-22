import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

// Pages
import { LoadingLaunch } from '../pages/loading-launch/loading-launch';

// Providers
import { AuthService } from '../providers/auth-service';

import 'rxjs/add/operator/map';

/*
  Generated class for the SecurePage provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SecurePage {

  constructor(public authSrv?: AuthService, public nav?: NavController) {
    console.log("secure page init")
  }

  ionViewCanEnter(): boolean {
   // here we can either return true or false
   // depending on if we want to leave this view
   console.log("Checking secure page")
   if(this.authSrv.Profile){
    //  console.log("Profile Exists");
      return true;
    } else {
      // console.log("Profile Definitely Does Not Exist");
      this.nav.push(LoadingLaunch, {});
      return false;
    }
  }

}
