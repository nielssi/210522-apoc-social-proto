import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//Services
import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {
  section: any;
  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Profile Page');
  }

}
