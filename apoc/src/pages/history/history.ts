import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
// Services
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

// Resources
import { Activity } from '../../providers/resources/Activity/Activity';
import { ActivitiesResource } from '../../resources/activity.resource';

// Pages
import { Problem } from '../problem/problem';

/*
  Generated class for the History page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
  providers: []
})
export class History extends SecurePage {
  public userActivity: any[] = [];

  constructor(public navCtrl: NavController,
              public authSrv: AuthService,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              public activityRes: ActivitiesResource) {
    super(authSrv, navCtrl);
  }

  ionViewDidLoad() {
    console.log('Hello History Page');
    // this.loadUserActivity();
  }

  loadUserActivity() {
    let loader = this.showLoadingMessage("Loading History", 10000);

    this.activityRes.usersActivity(this.authSrv.jwt)
    .then((success: any[]) => {
      success.forEach((item, idx) =>{
        this.userActivity.unshift(item);
      });
      loader.dismiss();
    })
    .catch((err) => {
      console.error(err);
      loader.dismiss();
    });
  }

  tappedItemInHistory(item: any) {
    console.log(item);
    this.nav.push(Problem, { activeProblem: item.problem });
  }

  showLoadingMessage(message :string, duration?: number, callback?): Loading{
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

}
