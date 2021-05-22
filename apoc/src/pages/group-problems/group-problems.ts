import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ActionSheetController, Platform } from 'ionic-angular';
// Services
import { AppSettings } from '../../providers/app-settings';
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';
// Pages
import { Problem } from '../problem/problem';
//Resources
import { Problems } from '../../providers/problems';
import { GroupsResource } from '../../resources/group.resource';

@Component({
  selector: 'page-group-problems',
  templateUrl: 'group-problems.html'
})
export class GroupProblems extends SecurePage {
  activeGroup: any = { members: [{name: 'test', bio: 'Testing 123'}], problems: [] };
  groupProblems: any[] = [];
  assetUrlPrefix: string = new AppSettings().SERVER_URL+"/assets/images/problems/";
	assetUrlSuffix: string = "_Q.png";

  constructor(public navCtrl: NavController, public authSrv: AuthService,
              private navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              private problemRes: Problems,
              public platform: Platform,
              private groupRes: GroupsResource,
              public toastCtrl: ToastController) {
    super(authSrv, navCtrl);
    this.activeGroup = navParams.get('activeGroup');
    this.groupProblems = this.activeGroup.problems;
  }

  getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {
      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    } else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
	}

  getAssetUrl(gp_id: any) {
		return this.assetUrlPrefix+gp_id+this.assetUrlSuffix;
	}

  ionViewDidLoad() {
    console.log('Hello GroupProblems Page');
  }

  tappedProblem(problem: any) {
    // Go to Problem page for tapped problem
    this.navCtrl.push(Problem, {activeProblem: problem});
  }

  didPressProblem(problem, $index) {
    let buttonArr = [
      {
        text: 'Remove Problem From Group',
        role: 'destructive',
        handler: () => {
          console.log('Remove clicked');
          this.tappedRemoveProblemFromGroup(problem, $index);

        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ];
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Problem Options',
      buttons: buttonArr
    });
    actionSheet.present();
  }

  tappedRemoveProblemFromGroup(problem, $index){
    console.log('removing ', problem, $index);
    this.groupProblems.splice($index, 1);
    this.activeGroup.problems = this.activeGroup.problems.filter(item => {
      var shouldReturn = true;
      if(item._id==problem._id){
        shouldReturn = false;
      }
      return shouldReturn
    });

    // //NEED TO: Save changes to user Profile to server
    this.groupRes.update(this.activeGroup)
    .then((success)=>{
      this.activeGroup = success;
      //Notify user that problem is not listed in his bookmarks.
      let toast = this.toastCtrl.create({
        message: problem.name+' was successfully removed from the group.',
        duration: 1300
      });
      toast.present();
    })
    .catch((err)=>{
      console.error(err)
    });
  }
}
