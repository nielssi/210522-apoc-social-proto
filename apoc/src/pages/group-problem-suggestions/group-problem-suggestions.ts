import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
//Services
import { AuthService } from '../../providers/auth-service';

// Resources
import { Problems } from '../../providers/problems';
import { GroupsResource } from '../../resources/group.resource';

// Pages
import { Problem } from '../problem/problem';


/*
  Generated class for the GroupProblemSuggestions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-group-problem-suggestions',
  templateUrl: 'group-problem-suggestions.html'
})
export class GroupProblemSuggestionsPage {
  public suggestableGroups: any[] = [];
  public activeProblem : any;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              private problemsRes: Problems,
              private groupRes: GroupsResource,
              private navParams: NavParams,
              public authSrv: AuthService,
            public toastCtrl: ToastController) {
              this.activeProblem = this.navParams.get('activeProblem');

              }

  ionViewDidLoad() {
    console.log('Hello GroupProblemSuggestionsPage Page');
    this.getUsersGroups();
  }

  tappedGroup(group: any) {
    console.log('tapped Group', group);
    // Add activeProblem to the tapped group and navigate back to problem view.

    // Check to see if problem is already in the group first
    let pushToArray = new Promise((resolve, reject) => {
      let thePush = true;
      if (group.problems.length === 0) {
        resolve(thePush);
      } else {
        console.log("group problems length ", group.problems.length);
        group.problems.forEach((element,index) => {
          if (element._id === this.activeProblem._id){
            // don't push into array!
            thePush = false;
            resolve(thePush);
          } else {
            if (index === group.problems.length - 1) {
              resolve(thePush);
            }
          }
        });
      }
    });

    // update problem in groups based on push to array promise
    pushToArray.then((thePushToArrayBool) => {
        if (thePushToArrayBool) {
          group.problems.push(this.activeProblem);
          this.groupRes.update(group, this.authSrv.jwt)
            .then(success => {
              console.log(success);
              let toast = this.toastCtrl.create({
                message: 'Problem was successfully added to ' + group.name,
                duration: 1000
              });
              toast.present();

              setTimeout(()=>{
                this.viewCtrl.dismiss();
              }, 1000);
            })
            .catch(err => {
              console.error(err);
            })
        } else {

          let toast = this.toastCtrl.create({
            message: 'Problem was already in ' + group.name,
            duration: 1000
          });
          toast.present();

          setTimeout(()=>{
            this.viewCtrl.dismiss();
          }, 1000);

        }
    }).catch((err) => {
      console.log("error getting to push bool ", JSON.stringify(err));
    });


  }

  getUsersGroups(refresher?){
    this.suggestableGroups = [];
    this.groupRes.usersGroups(this.authSrv.jwt)
    .then((groups:any) => {
      console.log('getUsersGroups: ', groups);
      this.suggestableGroups.push(...groups);
      //Check if any groups belong to current user.
      this.groupsBelongToCurrentUser();
      if(refresher){
        refresher.complete();
      }
    })
    .catch((err) => {
      console.error(err);
      refresher.complete();
    });
  }


  groupsBelongToCurrentUser(){
    this.suggestableGroups.forEach((itm, idx)=>{
      if(this.authSrv.Profile.groups.indexOf(itm._id)==-1){
        //Not Owner of Group
      }else{
        //Is Owner of Group
        itm.is_current_owner = true;
      }
    })
  }

}
