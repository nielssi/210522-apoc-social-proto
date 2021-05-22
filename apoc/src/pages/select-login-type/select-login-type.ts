import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Facebook, GooglePlus } from 'ionic-native';

// Pages
import { Feed } from '../feed/feed';
import { Login } from '../login/login';
import { Signup } from '../signup/signup';

//Services
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-select-login-type',
  templateUrl: 'select-login-type.html'
})
export class SelectLoginTypePage {

  constructor(public navCtrl: NavController, private authService: AuthService, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('Hello SelectLoginTypePage Page');
  }

  tappedBackButton() {
    this.navCtrl.popToRoot({});
  }

  tappedSignupWithEmail() {
    this.navCtrl.push(Signup, {});
  }

  tappedSignupWithGoogle() {
    let loading = this.showLoadingMessage("Authenticating...", 1000);

    GooglePlus.login({})
    .then((success)=>{
      console.log("GOOGLE:", JSON.stringify(success));
      let googleUser = success;
      let userInfo = {
        email: googleUser.email,
        username: googleUser.email,
        name: googleUser.displayName,
        password: "Letmein123"
      };
      console.log("sending signup request.", JSON.stringify(userInfo));

      this.authService.submitEmailSignupRequest(userInfo)
      .then((data)=>{
        console.log("Did submit signup request: ", JSON.stringify(data));
        loading.data.content = "Welcome to APOC! Just a moment while we synthesize your dashboard...";
        setTimeout(() => {
          loading.dismiss();
          //Redirect to user dashboard now.
          this.navCtrl.setRoot(Feed, {});
        }, 800);
      })
      .catch((err)=>{
          console.log("FAILED SIGNUP REQUEST USER ALREADY EXISTED", JSON.stringify(err));
          //User already exists
          if(err.errors.email.message=="The specified email address is already in use."){
            loading.data.content = "Performing Login";
            console.log("Handle account already created.");

            let userInfo = {
              email: googleUser.email,
              username: googleUser.email ? googleUser.email : '',
              password: "Letmein123"
            };

            this.authService.submitEmailSigninRequest(userInfo)
            .then(success =>{
              console.log(success);
              loading.data.content = "Welcome to APOC! Just a moment while we synthesize your dashboard...";
              setTimeout(() => {
                loading.dismiss();
                this.navCtrl.setRoot(Feed, {});
              }, 800);
            })
            .catch(err => {
              console.error(err);
              setTimeout(() => {
                loading.dismiss();
              }, 800);
            });
          }
      });

      //Save google user to database, then redirect user to Feed page

      // this.navCtrl.push(Feed, {});
    }, (err)=>{
      console.log(err);
    });
  }

  tappedSignupWithFacebook() {
    let loading = this.showLoadingMessage("Authenticating...", 2000);

    Facebook.getLoginStatus()
    .then(success=>{
        console.log("getLoginStatus: ", success);
    })
    .catch(err=>{
      console.error(err);
    })

    Facebook.login(['email', 'public_profile'])
    .then((success)=>{
      console.log("FACEBOOK:", JSON.stringify(success));
      Facebook.api('/me?locale=en_US&fields=id,name,first_name,last_name,picture,email', ['email', 'public_profile'])
      .then(success=>{
        console.log("/me ",JSON.stringify(success));
        let facebookUser = success;
        let userInfo = {
          email: facebookUser.email,
          username: facebookUser.email,
          name: facebookUser.name,
          password: "Letmein123"
        };

        // console.log("sending signup request.", JSON.stringify(userInfo));

        this.authService.submitEmailSignupRequest(userInfo)
        .then((data)=>{
          console.log("Did submit signup request: ", JSON.stringify(data));
          loading.data.content = "Welcome to APOC! Just a moment while we synthesize your dashboard...";
          setTimeout(() => {
            loading.dismiss();
            //Redirect to user dashboard now.
            this.navCtrl.setRoot(Feed, {});
          }, 800);
        })
        .catch((err)=>{
          console.log("FAILED SIGNUP REQUEST USER ALREADY EXISTED", JSON.stringify(err));
          //User already exists
          loading.data.content = "Performing Login";
          console.log("Handle account already created.");
          if(err.errors.email.message=="The specified email address is already in use."){
            let userInfo = {
              email: facebookUser.email ? facebookUser.email : '',
              username: facebookUser.email ? facebookUser.email : '',
              password: "Letmein123"
            };

            this.authService.submitEmailSigninRequest(userInfo)
            .then(success =>{
              console.log(success);
              loading.data.content = "Welcome to APOC! Just a moment while we synthesize your dashboard...";
              setTimeout(() => {
                loading.dismiss();
                this.navCtrl.setRoot(Feed, {});
              }, 1800);
            })
            .catch(err => {
              console.error(err);
              setTimeout(() => {
                loading.dismiss();
              }, 800);
            });
          }else{
            console.log("Unknown error occurred", err)
          }
        });

      })
      .catch(err=>{
        console.error(err);
      })
      //Save facebook user to database, then redirect user to Feed page
      // this.navCtrl.push(Feed, {});
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  tappedAlreadyHaveAnAccount() {
    this.navCtrl.push(Login, {});
  }

  private showLoadingMessage(message :string, duration :number, callback?): Loading{
    let loader = this.loadingCtrl.create({
      content: message,
      duration: duration,
      dismissOnPageChange: true
    });
    loader.present();

    setTimeout(() => {
      if(callback){
        callback()
      }
    }, duration);

    return loader;
  }
}
