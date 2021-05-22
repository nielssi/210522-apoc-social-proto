import { Component } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';

//Pages
import { Login } from '../login/login';
import { SelectLoginTypePage } from '../select-login-type/select-login-type';

//Components
import { Walkthrough } from '../walkthrough/walkthrough';

/*
  Generated class for the Launch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-launch',
  templateUrl: 'launch.html'
})
export class Launch {

  constructor(private navController: NavController, public menuCtrl: MenuController, public platform: Platform) {

  }

  disableAuthenticatedMenu() {
    this.menuCtrl.enable(false, 'authenticated-left');
    this.menuCtrl.enable(false, 'authenticated-right');
  }

  tappedSignUp() {
    this.navController.push(SelectLoginTypePage, {});
  }

  tappedViewWalkthrough() {
    this.navController.push(Walkthrough, {});
  }

  tappedLogin(){
      this.navController.push(Login, {});
  }

  ionViewDidLoad() {
    this.disableAuthenticatedMenu();
  }
}
