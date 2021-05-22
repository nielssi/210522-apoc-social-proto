import { Component } from '@angular/core';
import { App, ViewController, NavController, AlertController, ToastController, ActionSheetController, LoadingController, Loading  } from 'ionic-angular';
//Services
import { AuthService } from '../../../providers/auth-service';
import { SecurePage } from '../../../providers/secure-page';
//Resources
import { GroupsResource } from '../../../resources/group.resource';
//Pages
import { GroupHomePage } from '../../group-home/group-home';

/*
  Generated class for the GroupsRecommended page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-groups-recommended',
  templateUrl: 'groups-recommended.html'
})
export class GroupsRecommendedPage {
  public myFunctionalGroups:any = [];
  public recommendedGroups:any[] = [];
  public activeUserId: string = '';
  public activeGroup: any;
  public activeGroupIndex: any;

  constructor(public navCtrl: NavController,
      public alertCtrl: AlertController,
      public toastCtrl: ToastController,
      public groupRes: GroupsResource,
      public authSrv: AuthService,
      public actionSheetCtrl: ActionSheetController,
      public viewCtrl: ViewController,
      public appCtrl: App,
      private loadingCtrl: LoadingController
    ) {
    // super(authSrv, navCtrl);


  }


  ionViewDidEnter() {
    // console.log("ionViewDidEnter");

  }

  ionViewDidLoad() {
    console.log('Hello GroupsRecommendedPage Page');
    this.activeUserId = this.authSrv.Profile._id;

  }

  ionViewWillEnter(){
    // console.log("ionViewWillEnter");
    this.getRecommendedGroups();
  }

  doRefresh(refresher){
    this.getUsersGroups(refresher);
  }

  initGroupList(){
    this.getUsersGroups();
  }

  tappedCreateFunctionalGroup(){
  	//Show popup to allow user to provide group name
    console.log("tappedCreateFunctionalGroup");
    let prompt = this.alertCtrl.create({
      title: 'Create Group',
      message: "Create a group to share and organize organic chemistry problems with your friends or in class.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Group Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: group => {
            this.createNewGroup(group);
            console.log('Saved clicked', group);
          }
        }
      ]
    });
    prompt.present();
  };

  addFunctionalGroupToList(group){
	  this.myFunctionalGroups.unshift(group);
  }

  tappedBrowseFunctionalGroups(){

  }

  public didPressGroup(group, index) {
    this.activeGroup = group;
    this.activeGroupIndex = index;
    let buttonArr  = [
      {
        text: 'Permanently Delete Group',
        role: 'destructive',
        handler: () => {
          console.log('Delete clicked');
          this.tappedDeleteGroup(this.activeGroup, this.activeGroupIndex);
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
      title: 'Group Options',
      buttons: buttonArr
    });
    actionSheet.present();
  }


  createNewGroup(group){
    this.groupRes.create(group, this.authSrv.jwt)
    .then((new_grp: any) => {
      this.groupRes.get(new_grp._id, this.authSrv.jwt)
      .then((grp: any) => {
        console.log('the new group', grp);
      });
      new_grp.is_current_owner = true;

      this.getUsersGroups();
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  tappedDeleteGroup(group, $index){
    //Confirm Action With User
    this.groupRes.inactivateGroup(group, this.authSrv.jwt);
    this.myFunctionalGroups.splice($index, 1);
  };

  sendFunctionalGroupInviteWithEmail(invitee){
    console.log("sendFunctionalGroupInviteWithEmail", invitee);
    this.groupRes.inviteUserWithEmail(invitee)
    .then((success)=>{
      console.log(success);
      setTimeout(()=>{
        let toast = this.toastCtrl.create({
          message: 'Invite was Sent Successfully!',
          duration: 3000
        });
        toast.present();
      }, 500);

    })
    .catch((err)=>{
      console.error(err);
    })
  }

  tappedInviteUserToFunctionalGroup(slidingItem){
    console.log("tappedInviteUserToFunctionalGroup", slidingItem);
    //Show invitee input form.
    let prompt = this.alertCtrl.create({
      title: 'Invite User',
      message: "Enter the Name and Email of the person you would like to invite.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send Invite!',
          handler: data => {
            console.log('Saved clicked', data);
            //If data is good, send invite
            this.sendFunctionalGroupInviteWithEmail(data);
          }
        }
      ]
    });
    prompt.present();
  }

  getUsersGroups(refresher?){
    this.myFunctionalGroups = [];
    this.groupRes.usersGroups(this.authSrv.jwt)
    .then((groups:any) => {
      console.log('getUsersGroups: ', groups);
      this.myFunctionalGroups.push(...groups);
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

  getRecommendedGroups() {
    let loader = this.showLoadingMessage("Loading Groups", 10000);

    this.groupRes.getRecommended(this.authSrv.jwt)
    .then((groups:any) => {
      console.log('recommended', groups);
      this.recommendedGroups = [];
      this.recommendedGroups.push(...groups);
      loader.dismiss();
    })
    .catch((err) => {
      console.error(err);
      loader.dismiss();
    });
  }

  groupsBelongToCurrentUser(){
    this.myFunctionalGroups.forEach((itm, idx)=>{
      if(this.authSrv.Profile.groups.indexOf(itm._id)==-1){
        //Not Owner of Group
      }else{
        //Is Owner of Group
        itm.is_current_owner = true;
      }
    })
  }

  tappedGroup(group){
    // this.viewCtrl.dismiss();
    this.navCtrl.push(GroupHomePage, { activeGroup: group });
    // this.appCtrl.getActiveNav().popToRoot();
    // this.appCtrl.getRootNav().push(GroupPage, { activeGroup: group });
  }

  showLoadingMessage(message :string, duration?:number, callback?): Loading{
		let loader = this.loadingCtrl.create({
			content: message,
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
