import { Component } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';

//Models
import { UserSignIn } from '../../models/user-sign-in/user-sign-in';

//Pages
import { Launch } from '../launch/launch';
import { Feed } from '../feed/feed';

//Components
import { Walkthrough } from '../walkthrough/walkthrough';
//Services
import { AuthService } from '../../providers/auth-service';
import { AccountService } from '../../providers/account-service';

/*
  Generated class for the Launch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-loading-launch',
  templateUrl: 'loading-launch.html'
})
export class LoadingLaunch {
  userSignIn;
  constructor(private navController: NavController, private authService: AuthService, private accountService: AccountService, public menuCtrl: MenuController, public platform: Platform) {
    console.log("LoadingLaunch")
  }

  disableAuthenticatedMenu() {
    this.menuCtrl.enable(false, 'authenticated-left');
    this.menuCtrl.enable(false, 'authenticated-right');
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      if (this.platform.is('core')) {
        // this is a browser
        this.navController.setRoot(Launch);
      } else {
        // this is a device
        this.performAutomaticSignIn();
      }
    });

    this.disableAuthenticatedMenu();

  }
  submitAutomaticSignInRequest(uSignIn){
  	this.authService.submitEmailSigninRequest(uSignIn)
  	.then((success) =>{
  		console.log(success);
  		//Redirect to user dashboard.
  		this.navController.setRoot(Feed);
  	})
  	.catch((err) => {
  		console.error('Error: submitAutomaticSignInRequest' + JSON.stringify(err));
  	})
  }

  performAutomaticSignIn(){
  	this.accountService.didCompleteWalkthrough()
  	.then((walkthrough:any)=>{
  		if(walkthrough.didComplete){
  			//Skip Walkthrough
  			console.log("Skpping walkthrough");
        console.log(JSON.stringify(walkthrough))
        this.accountService.getStoredData()
        .then((success :any) => {
          console.log("got stored data")
          console.log(JSON.stringify(success))
          if(success.email.length>0 || success.password.length>0){
            //User Account was previously remembered
            console.log("User Acocunt was previously remembered.");
            this.userSignIn = new UserSignIn(success.email, success.password);
            this.submitAutomaticSignInRequest(this.userSignIn);

          }else{
            this.navController.setRoot(Launch);
            //User Account was not previously remembered, check if they have completed walkthrough
            //this.navController.push(About, {});
          };
        })
        .catch((err) => {
          this.navController.setRoot(Launch);
          console.error("error getting stored data")
          console.error(JSON.stringify(err));
        });
  		}else{
  			//Send to Walkthrough
  			console.log("Doing Walkthrough", JSON.stringify(walkthrough));
		  	this.navController.push(Walkthrough, {});
  		}
  	})
  	.catch((err)=>{
      console.error("Error checking walkthrough completion")
  		console.error(err);
  	});
  }
}
