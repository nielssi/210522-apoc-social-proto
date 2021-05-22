import { Component } from '@angular/core';
import { NavController, PopoverController, LoadingController, Loading, MenuController } from 'ionic-angular';

//  Models
import { UserSignUp } from '../../models/user-sign-up/user-sign-up';

// Pages
import { Feed } from '../feed/feed';
import { Login } from '../login/login';
import { SelectLoginTypePage } from '../select-login-type/select-login-type';

//Services
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class Signup {

  userSignUp;
	tappedSignupWithApoc;
	showSignupWithApoc;

  constructor(private nav: NavController, private authService: AuthService, public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public menuCtrl: MenuController) {
    // this.userSignUp = new UserSignUp('jspenc72', 'jspenc72@gmail.com', 'Letmein123');
    this.userSignUp = new UserSignUp('', '', '');
  	this.showSignupWithApoc = false;
  }

  submitEmailSignupForm(signUpData) {
    console.log("submitEmailSignupForm", signUpData, signUpData.value);
    
    let formGroup = signUpData.form;
    if(formGroup.status=="VALID"){
      let loading = this.showLoadingMessage("Authenticating...", 1000);
      this.authService.submitEmailSignupRequest(signUpData.value)
      .then((data)=>{
        console.log(data);
        loading.data.content = "Welcome to APOC! Just a moment while we synthesize your dashboard..."
        setTimeout(() => {
          loading.dismiss();
          //Redirect to user dashboard now.
          this.enableAuthenticatedMenu();
          this.nav.setRoot(Feed, {});
        }, 800);
      })
      .catch((err)=>{
          //User already exists
          loading.data.content = err.errors.email.message
          setTimeout(() => {
            loading.dismiss();
          }, 800);
          console.error(err);
      });
    }else{
      let loading = this.showLoadingMessage("A valid email and password is required to create your account...", 1800);
    }
  }

  enableAuthenticatedMenu() {
    this.menuCtrl.enable(true, 'authenticated-left');
    this.menuCtrl.enable(true, 'authenticated-right');
  }

  tappedAlreadyHaveAnAccount() {
    this.nav.push(Login, {});
  }

  //Information Popups
  tappedPrivacyPolicy(){
    console.log("tappedPrivacyPolicy");
  }

  tappedTermsofService(){
    console.log("tappedTermsofService");
  }

  ionViewDidLoad() {
    console.log('Hello Signup Page');
  }

  public tappedBackButton() {
    this.nav.popToRoot({});
  }

  public tappedAdditionalOptions() {
    this.nav.push(SelectLoginTypePage, {});
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
