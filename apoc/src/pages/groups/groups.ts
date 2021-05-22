import { Component } from '@angular/core';
import { App, ViewController, NavController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
// Tabs
import { GroupsIsMemberPage } from './groups-is-member/groups-is-member';
import { GroupsRecommendedPage } from './groups-recommended/groups-recommended';

//Services
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

//Resources
// import { FunctionalGroup } from '../../providers/resources/functional-group/functional-group';
import { GroupsResource } from '../../resources/group.resource';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {
  public tab1: any = GroupsIsMemberPage;
  public tab2: any = GroupsRecommendedPage;

  constructor(public navCtrl: NavController, public authSrv: AuthService) {
    // super(authSrv, navCtrl);


  }
}
