import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { ImagePicker, MediaCapture, CaptureError, CaptureImageOptions, File } from 'ionic-native';
//Services
import { AuthService } from '../../providers/auth-service';
import { AwsS3 } from '../../providers/aws-s3';
// Resourfces
import { ActivitiesResource } from '../../resources/activity.resource';

// Pages
import { Problem } from '../../pages/problem/problem';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile-public',
  templateUrl: 'profile-public.html'
})
export class ProfilePublic {
  public section: any;
  public activeProblem: any;
  public userProfile: any;
  public userActivity: any[] = [];
  public activeActivity: any;
  public activeMember: any;
  public isFollowing: boolean = false;
  public isSelf: boolean = false;

  constructor(public navCtrl: NavController, private params: NavParams, public nav: NavController,
              private authSrv: AuthService,
              public toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              public actionSheetCtrl: ActionSheetController,
              public activityRes: ActivitiesResource,
              public awsUtil: AwsS3) {
    this.isFollowing = false;
    this.activeActivity = this.params.get('activeItem');
    this.activeMember = this.params.get('activeMember');

    // Set userProfile
    this.userProfile = this.activeActivity ? this.activeActivity.owner : (this.activeMember ? this.activeMember : null);
    this.checkIsFollowing();
    this.checkIsSelf();
  }

  ionViewDidLoad() {
    this.loadUserPublicActivity(this.userProfile._id)
  }

  checkIsFollowing() {
    let f = this.authSrv.Profile.following.find(follower => {
      return follower = this.userProfile._id
    });
    if(f){
      this.isFollowing = true;
    }
  }

  checkIsSelf() {
    if(this.authSrv.Profile._id == this.userProfile._id){
      this.isSelf = true;
    }
  }

  loadUserPublicActivity(user_id) {
    this.activityRes.usersPublicActivity(this.authSrv.jwt, user_id)
    .then((success: any[]) => {
      success.forEach((item, idx)=>{
        this.userActivity.unshift(item);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  tappedFollow() {
    if(this.isFollowing){
      this.authSrv.unFollowUser(this.userProfile._id)
      .then(me => {
        let toast = this.toastCtrl.create({
				  message: 'You unfollowed '+this.userProfile.name,
				  duration: 1300
				});
				toast.present();
      })
      .catch(err => {
        console.error(err);
      })
    }else{
      this.authSrv.followUser(this.userProfile._id)
      .then(me => {
        let toast = this.toastCtrl.create({
				  message: 'You are now following '+this.userProfile.name,
				  duration: 1300
				});
				toast.present();
      })
      .catch(err => {
        console.error(err);
      })
    }
    this.isFollowing = !this.isFollowing;
  }

  tappedActivity(activity){
    this.nav.push(Problem, { activeProblem: activity.problem });
  }
}
