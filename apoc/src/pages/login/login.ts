import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController,  ModalController, Loading, MenuController } from 'ionic-angular';
import { Facebook, GooglePlus } from 'ionic-native';

//  Models
import { UserSignIn } from '../../models/user-sign-in/user-sign-in';

//Components
import { PasswordResetModal } from './password-reset-modal/PasswordResetModal.component';

// Pages
import { Feed } from '../feed/feed';
import { Signup } from '../signup/signup';

//Services
import { AuthService } from '../../providers/auth-service';
import { AccountService } from '../../providers/account-service';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
  userSignIn;
	showForgotPassword = false;
	submitEmailSigninForm;
	openPasswordResetModal;
	toggleForgotPassword;
	closePasswordResetModal;
  constructor(private nav: NavController,
              private authService: AuthService,
              private accountService: AccountService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              public modalCtrl: ModalController, public menuCtrl: MenuController) {
		let thisCtrl = this;
		// this.userSignIn = new UserSignIn('jesse@cindt.com', 'Letmein123');
    this.userSignIn = new UserSignIn('', '');
		this.submitEmailSigninForm = function(form){
			console.log('ok: ', this.userSignIn, form.form);
      let formGroup = form.form;
      if(formGroup.status=="VALID"){
        let loader = this.showLoadingMessage("Authenticating...", null);
  			this.authService.submitEmailSigninRequest(this.userSignIn)
  			.then((success) =>{
  				loader.data.content = "Initializing..."
  				console.log(success);
  				setTimeout(() => {
  					loader.dismiss();
  					this.accountService.remember(this.userSignIn)
  					.then((success) => {
              this.enableAuthenticatedMenu();
              nav.setRoot(Feed);
  						//Redirect to user dashboard.
  					}, (err) => {
  						console.error(err);
  					})

  				}, 800);
  			})
  			.catch((err) => {
  				loader.data.content = err.message;
  				setTimeout(() => {
  					loader.dismiss();
  					console.log(thisCtrl.showForgotPassword);
  					thisCtrl.showForgotPassword = true;
  				}, 800)
  				console.log(err);
  			});
      } else{
        let loader = this.showLoadingMessage("A valid email and password is required.", 1800);
      }
		}
	}

  enableAuthenticatedMenu() {
    this.menuCtrl.enable(true, 'authenticated-left');
    this.menuCtrl.enable(true, 'authenticated-right');
  }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

  tappedBackButton() {
    this.nav.popToRoot({});
  }

	tappedDontHaveAnAccount(){
		this.nav.push(Signup, {});
	}

	tappedBeginResetPasswordButton(){
		this.presentPasswordResetModal()
	}
	presentPasswordResetModal() {
    let passwordResetModal = this.modalCtrl.create(PasswordResetModal, { userId: 8675309 });
    passwordResetModal.present();
	}
  showLoadingMessage(message :string, duration :number, callback?): Loading{
		let loader = this.loadingCtrl.create({
			content: message,
			duration: duration,
			dismissOnPageChange: false
		});
		loader.present();

		setTimeout(() => {
			if(callback){
				callback()
			}
		}, duration);

		return loader;
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
            this.nav.setRoot(Feed, {});
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
                  this.nav.setRoot(Feed, {});
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

        // this.nav.push(Feed, {});
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
              this.nav.setRoot(Feed, {});
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
                  this.nav.setRoot(Feed, {});
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
        // this.nav.push(Feed, {});
      })
      .catch((err)=>{
        console.error(err);
      })
    }



}
