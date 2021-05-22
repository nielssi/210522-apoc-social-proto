import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// Services
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

/*
  Generated class for the GroupSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-group-settings',
  templateUrl: 'group-settings.html'
})
export class GroupSettings extends SecurePage {
  activeGroup: any = { members: [{name: 'test', bio: 'Testing 123'}] };

  constructor(public navCtrl: NavController, public authSrv: AuthService, private navParams: NavParams) {
    super(authSrv, navCtrl);
    this.activeGroup = navParams.get('activeGroup');
  }

  ionViewDidLoad() {
    console.log('Hello GroupSettings Page');
  }

}
