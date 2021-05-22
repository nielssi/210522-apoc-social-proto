import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';
import { LoadingLaunch } from '../loading-launch/loading-launch';
/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
  shakeForRandom: boolean = false;
  push_preferences: string;
  shake_for_random: boolean;
  share_activity_publicly: boolean;
  constructor(public navCtrl: NavController, public localStorage: Storage,
              public authSrv: AuthService,
              private loadingCtrl: LoadingController) {
    this.getShakeForRandomPreference();
    console.log('preferences', this.authSrv.Profile.preferences);
    this.push_preferences = this.authSrv.Profile.preferences.push_preferences
    this.shake_for_random = this.authSrv.Profile.preferences.shake_for_random
    this.share_activity_publicly = this.authSrv.Profile.preferences.share_activity_publicly
  }

  ionViewDidLoad() {
    console.log('Hello Settings Page');
  }

  getShakeForRandomPreference(){
    var shakeForRandom = this.localStorage['preference.shakeForRandom'];
    console.log(shakeForRandom);
    this.shakeForRandom = shakeForRandom;
  }

  didToggleShakeForRandomQuestion(shake_for_random) {
    console.log(shake_for_random);
    this.localStorage['preference.shake_for_random'] = shake_for_random;
    this.updatePreferences()
  }

  pushPreferencesChanged() {
    console.log('pushPreferencesChanged: ', this.push_preferences);
    this.localStorage['preference.push_preferences'] = this.push_preferences;
    this.updatePreferences()
  }

  privacyPreferencesChanged() {
    console.log('privacyPreferencesChanged: ', this.share_activity_publicly);
    this.localStorage['preference.share_activity_publicly'] = this.share_activity_publicly;
    this.updatePreferences()
  }

  updatePreferences() {
    this.authSrv.updatePreferences({
      push_preferences: this.push_preferences,
      share_activity_publicly: this.share_activity_publicly,
      shake_for_random: this.shake_for_random
    })
    .then(success => {
      console.log('updatePreferences', success)
    })
    .catch(err =>{

    })
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
      this.navCtrl.push(LoadingLaunch, {});
      return false;
    }
  }

}
