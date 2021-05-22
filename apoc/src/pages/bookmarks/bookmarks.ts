import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading, MenuController, Platform, ActionSheetController } from 'ionic-angular';

import { AppSettings } from '../../providers/app-settings';

//Resources
import { Problems } from '../../providers/problems';

// Services
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

// Pages
import { Problem } from '../problem/problem';
import { LoadingLaunch } from '../loading-launch/loading-launch';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class Bookmarks {
  bookmarkedProblems: any = [];
	assetUrlPrefix: string = new AppSettings().SERVER_URL+"/assets/images/problems/";
	assetUrlSuffix: string = "_Q.png";
  isEditingList: boolean = false;
  isLoadingData: boolean = true; // Hides card if results are empty.
  activeBookmarkIndex: number;
  activeBookmark: any;
  didLoadBookmarks: boolean = false;
  constructor(private navCtrl: NavController,
        public authSrv: AuthService,
        public toastCtrl: ToastController,
        public platform: Platform,
        public actionSheetCtrl: ActionSheetController,
        private loadingCtrl: LoadingController,
        private problemRes: Problems) {
    // super(authSrv, navCtrl);

  }

  // ionViewWillEnter() {
  //   console.log('Hello Bookmarks Page - will enter');
  //   this.loadBookmarks();
  // }

  ionViewDidLoad() {
    console.log('Hello Bookmarks Page');
      this.loadBookmarks();
  }

	tappedProblem(problem) {
    // Go to Problem page for tapped problem
		this.navCtrl.push(Problem, {activeProblem: problem});
	}

  tappedRemoveProblemFromBookmark(problem, $index) {


    this.authSrv.Profile.bookmarks = this.authSrv.Profile.bookmarks.filter(item => {
      var shouldReturn = true;
      if(item == problem._id || item._id==problem._id){
        shouldReturn = false;
      }
      return shouldReturn
    });

    //NEED TO: Save changes to user Profile to server
    this.authSrv.saveUpdatestoProfile()
    .then((success)=>{
      this.bookmarkedProblems.splice($index, 1);
      //Notify user that problem is not listed in his bookmarks.
      let toast = this.toastCtrl.create({
        message: problem.name+' was successfully removed from your bookmarks.',
        duration: 1300
      });
      toast.present();
    })
    .catch((err)=>{
      console.error(err)
    });
  }
  //
	doRefresh(e) {
		this.loadBookmarks(e);
	}

	loadBookmarks(e?: any) {
    if(this.authSrv.Profile) {
        console.log("loadBookmarks");
        let loader = this.showLoadingMessage("Loading Bookmarks", 10000);
        //Loop through each bookmark and get its details.
        let count = 0;
        if(this.authSrv.Profile &&  this.authSrv.Profile.bookmarks){
          this.authSrv.Profile.bookmarks.forEach((item, idx)=>{
             this.problemRes.get(item)
                      .then(res => {
                        count++;
                        console.log(res);
                        this.bookmarkedProblems.unshift(res);
                        if(count === this.authSrv.Profile.bookmarks.length){
                          loader.dismiss();
                          this.didLoadBookmarks = true
                        }
                      })
                      .catch(err => {
                        count++;
                        console.error(err);
                        if(count === this.authSrv.Profile.bookmarks.length){
                          loader.dismiss();
                          this.didLoadBookmarks = true
                        }
                      });
          });
        }else{
          console.log(this.authSrv.Profile);
          this.authSrv.reloadProfile();
        }

        setTimeout(()=>{
          loader.dismiss();
          this.didLoadBookmarks = true
        }, 2500);
        if(e){
          setTimeout(()=>{
            e.complete();

          }, 1000);
        }
    } else {
      // for some reason it was loading this page... without
      // having a profile loaded... so i decided to redirect
      // because that was the easiest way
      this.navCtrl.push(LoadingLaunch, {});
    }
	}
	// Utility Methods
	getAssetUrl(gp_id) {
		return this.assetUrlPrefix+gp_id+this.assetUrlSuffix;
	}


  getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {

      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    }else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
	}


  tappedEditList() {
    this.isEditingList = !this.isEditingList;
    console.log(this.isEditingList);
  }


  reorderItems(indexes) {
    let element = this.bookmarkedProblems[indexes.from];
    this.bookmarkedProblems.splice(indexes.from, 1);
    this.bookmarkedProblems.splice(indexes.to, 0, element);
  }

  didPressBookmarkedProblem(problem, index) {
    this.activeBookmark = problem;
    this.activeBookmarkIndex = index;
    let buttonArr  = [
      {
        text: 'Remove Bookmark',
        role: 'destructive',
        handler: () => {
          console.log('Remove Bookmark Clicked');
          this.tappedRemoveBookmark(this.activeBookmark, this.activeBookmarkIndex);
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
      title: 'Bookmark Options',
      buttons: buttonArr
    });
    actionSheet.present();
  };

  tappedRemoveBookmark(problem, index){
    console.log('tappedRemoveBookmark', problem, index);
    this.bookmarkedProblems.splice(index, 1);

    this.authSrv.Profile.bookmarks.forEach((itm, idx) => {
      console.log(itm);
      if(itm == problem._id){
        this.authSrv.Profile.bookmarks.splice(idx, 1);
      };
    });

    this.authSrv.saveUpdatestoProfile()
    .then((success)=>{
      //Notify user that problem is not listed in his bookmarks.
      let toast = this.toastCtrl.create({
        message: problem.name+' was successfully removed from your bookmarks.',
        duration: 1300
      });
      toast.present();

    })
    .catch((err)=>{
      console.error(err)
    });
  };


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
