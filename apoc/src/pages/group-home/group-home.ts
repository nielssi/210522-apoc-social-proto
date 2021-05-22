import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

// Services
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

// Resources
import { GroupsResource } from '../../resources/group.resource';

// Pages
// import { GroupSettings } from '../group-settings/group-settings';
import { GroupMembers } from '../group-members/group-members';
// import { GroupDiscussions } from '../group-discussions/group-discussions';
import { GroupProblems } from '../group-problems/group-problems';

@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html'
})
export class GroupHomePage extends SecurePage {
  activeGroup: any = { members: [], problems: [], owner: ''};
  isMember: boolean = false;
  isOwner: boolean = false;
  averageProblemDifficultyRating: Number = 0; // Display as 5.0 / 10 Number
  averageCompletionRate: Number = 0;          // Display as 99% of problems complete

  constructor(public navCtrl: NavController,
              public authSrv: AuthService,
              public groupRes: GroupsResource,
              private navParams: NavParams,
              public toastCtrl: ToastController) {

    super(authSrv, navCtrl);
    console.log(this.navParams.get('activeGroup'));
    if(this.navParams.get('activeGroup')){
      this.activeGroup = navParams.get('activeGroup');
    }
    console.log(this.activeGroup);
    console.log('isAMember: ', this.checkMembershipStatus(this.activeGroup));
    console.log('isOwner: ', this.checkOwnershipStatus(this.activeGroup));

    this.isMember = this.checkMembershipStatus(this.activeGroup);
    this.isOwner = this.checkOwnershipStatus(this.activeGroup);
  }

  checkMembershipStatus(group){
    let membershipStatus = false;
    if(this.authSrv.Profile && this.authSrv.Profile.groups){
      this.activeGroup.members.forEach((itm, idx) => {
        if(itm._id == this.authSrv.Profile._id){
          membershipStatus = true;
        }
      });
    }
    return membershipStatus;
  };

  checkOwnershipStatus(group){
    let ownershipStatus = false;
    if(group.owner == this.authSrv.Profile._id){
      ownershipStatus = true;
    }
    return ownershipStatus;
  };

  ionViewDidLoad() {
    console.log('Hello GroupHomePage Page');
  }

  // tappedViewGroupSettings(){
  // 	this.navCtrl.push(GroupSettings, {});
  // }

  tappedViewGroupMembers(){
  	this.navCtrl.push(GroupMembers, { activeGroup: this.activeGroup });
  }

  // tappedViewGroupDiscussions(){
  // 	this.navCtrl.push(GroupDiscussions, {});
  // }

  tappedViewGroupProblems(){
  	this.navCtrl.push(GroupProblems, { activeGroup: this.activeGroup });
  }

  updateGroup(group: any){
    this.groupRes.update(group, this.authSrv.jwt)
    .then((update_grp: any)=>{
      console.log('Updated group: ', update_grp);
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  tappedJoinGroup(group: any) {
    console.log('join' , group);

    this.groupRes.joinGroup(group, this.authSrv.jwt)
    .then((updates: any)=>{
      console.log('Join group: ', updates.group, updates.profile);
      //Notify user that problem is not listed in his bookmarks.
      this.activeGroup = updates.group;
      let toast = this.toastCtrl.create({
        message: 'You joined '+updates.group.name,
        duration: 1300
      });
      toast.present();
      this.isMember = true;
    })
    .catch((err)=>{
      console.error(err);
    });
  }

  tappedLeaveGroup(group: any) {
    console.log('leave', group, group.members.length);

    if(group.owner == this.authSrv.Profile._id){
      //Notify user that problem is not listed in his bookmarks.
      let toast = this.toastCtrl.create({
        message: 'You are the owner of '+group.name+'. You must transfer ownership before you can leave this group.',
        duration: 1800
      });
      return toast.present();
    }else{
      // Remove user from group

      this.groupRes.leaveGroup(group, this.authSrv.jwt)
      .then((updates: any) => {
        console.log('Left group: ', updates.group, updates.profile);
        //Notify user that problem is not listed in his bookmarks.
        this.activeGroup = updates.group;
        let toast = this.toastCtrl.create({
          message: 'You left '+updates.group.name,
          duration: 1300
        });
        toast.present();
        this.isMember = false;
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }


  tappedBackButton(){
    console.log('tapped back button.');
  }

  updateGroupNews(sticky_note: string) {
    console.log("updateGroupNews:", sticky_note);
    this.updateGroup(this.activeGroup);
  }

}
