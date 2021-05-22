import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push, Shake } from 'ionic-native';
import { SocketService } from '../providers/socket.service';

//Pages
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { Launch } from '../pages/launch/launch';
import { LoadingLaunch } from '../pages/loading-launch/loading-launch';
import { Feed } from '../pages/feed/feed';
import { History } from '../pages/history/history';
import { RandomQuestion } from '../pages/random-question/random-question';
import { Explore } from '../pages/explore/explore';
import { Settings } from '../pages/settings/settings';
import { Profile } from '../pages/profile/profile';
import { EditProfile } from '../pages/edit-profile/edit-profile';
import { ProfilePublic } from '../pages/profile-public/profile-public';
import { GroupsPage } from '../pages/groups/groups';
import { RecommendationsPage } from '../pages/recommendations/recommendations';
import { Bookmarks } from '../pages/bookmarks/bookmarks';
import { About } from '../pages/about/about';
import { Problem } from '../pages/problem/problem';
import { BrowseCategoriesPage } from '../pages/browse-categories/browse-categories'

// Resources
import { Problems } from '../providers/problems';
import { AccountService } from '../providers/account-service';

import { AuthService } from '../providers/auth-service';
import { Storage } from '@ionic/storage';
// PouchBD
import { ProblemPouch } from  '../pouches/problem.pouch';
import { UserPouch } from  '../pouches/user.pouch';
import { ImageService } from '../providers/image.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public userProfile: any = {};
  public allProblems: any[];
  public rootPage: any = LoadingLaunch;
  public globalActivity: any[] = [];
  public Profile: any = {
    name: '',
    bio: '',
    achievements: [],
    viewedProblems: [],
    solvedProblems: [],
    bookmarks: [],
    groups: []
  };

  public pages: Array<{title: string, component: any, icon: string}>
  public pagesGroup1: Array<{title: string, component: any, icon: string}>
  public pagesGroup2: Array<{title: string, component: any, icon: string}>
  public pagesGroup3: Array<{title: string, component: any, icon: string}>
  public pagesGroup4: Array<{title: string, component: any, icon: string}>

  constructor(public platform: Platform,
              private authSrv: AuthService,
              private accountService: AccountService,
              private problemsRes: Problems,
              public localStorage: Storage,
              public menuCtrl: MenuController,
              public problemPouch: ProblemPouch,
              public userPouch: UserPouch,
              public imageService: ImageService) {

    this.initializeApp();

    // console.log(this.userProfile);
    // used for an example of ngFor and navigation
    this.pagesGroup1 = [
      { title: 'Browse Feed', component: Feed, icon: 'md-list' },
      { title: 'Search Problems', component: BrowseCategoriesPage, icon: 'md-search' },
      { title: 'History', component: History, icon: 'ios-book'  },
      { title: 'Bookmarks', component: Bookmarks, icon: 'ios-bookmarks'  }
    ];

    this.pagesGroup2 = [
      { title: 'Groups', component: GroupsPage, icon: 'ios-people'  },
      { title: 'Recommendations', component: RecommendationsPage, icon: 'ios-color-wand'  }
    ];

    this.pagesGroup3 = [
      { title: 'About', component: About, icon: 'md-information'  },
      { title: 'Settings', component: Settings, icon: 'ios-cog'  },
    ];


    this.pagesGroup4 = [
      { title: 'Sign Out', component: Launch, icon: 'ios-log-out'  }
    ];

    this.pages = [
      { title: 'Login', component: Login, icon: ''  },
      { title: 'Signup', component: Signup, icon: ''  },
      { title: 'Launch', component: Launch, icon: ''  },
      { title: 'Friend Feed', component: Feed, icon: ''  },
      { title: 'Explore', component: Explore, icon: ''  },
      { title: 'Settings', component: Settings, icon: ''  },
      { title: 'Groups', component: GroupsPage, icon: ''  },
      { title: 'Bookmarks', component: Bookmarks, icon: ''  },
      { title: 'About this App', component: About, icon: ''  }
    ];

    this.getProblems()
    setTimeout(()=>{
      this.getGlobalActivityFeed()
    }, 500);
  }

  getProblems() {
    this.problemsRes.query().then((success: any) => {
      // console.log('Got ' + success.length + ' problems from app component');
      this.allProblems = success;
      // Init shake for random.
      this.initShakeForRandom();
    });
  }

  initShakeForRandom(){
    // Random Problem

    if (this.platform.is('core')) {
      // Browser
      // console.log("is Browser skipping shake setup.");
    } else {
      // Device
      // console.log("is Device running shake setup.");
      let watch = Shake.startWatch(40)
          .subscribe(() => {
            // console.log("Did shake");
            let tmpMax = this.allProblems.length;
            let randProblemId = 0;
            let pref = this.localStorage['preference.shakeForRandom'];

            this.accountService.getShakePreference()
            .then((pref: any)=>{
              // console.log('getShakePreference: ', pref);
              //
              //
              //


            })
            .catch((err) => {
              console.error('Shake Preference: ', err);
            });

            // console.log(pref, this.allProblems.length);

            //Skip if there are no problems

            if(tmpMax>0){
                randProblemId = Math.floor(Math.random()*tmpMax);
                // Get the problem from Array
                console.log("Registered shake");
                this.nav.push(Problem, {activeProblem: this.allProblems[randProblemId]});
                // this.nav.setRoot(Problem, {activeProblem: this.allProblems[randProblemId]});
                console.log("Skipping random problem due to user settings.");
            } else{
              console.log("Skipping random problem due to an empty allProblems array.");
            }
          });
    }
  }

  disableAuthenticatedMenu() {
    this.menuCtrl.enable(false, 'authenticated-left');
    this.menuCtrl.enable(false, 'authenticated-right');
  }

  initializeApp() {
    this.disableAuthenticatedMenu();
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // Init Push Notiications if on Device
      if (this.platform.is('core')) {
        console.log('is Browser');

      } else{
        console.log('is Device');
        this.initPushNotifications();
      }
      // Init PouchDB
      // this.initPouchDB();

    });
  }

  initPouchDB() {
    this.problemPouch.init()
    .then(()=>{
      console.log('PouchDB READY!');
      return this.problemPouch.db.allDocs({include_docs:true});
    })
    .then((result) => {
      // handle result
      if(result.rows.length>0){
        throw new Error('PouchDB previously initialized.');
      }else{
        return this.problemsRes.query()
      }
    })
    .then((success: any[]) => {
      success.forEach((itm, idx)=>{
        delete itm.__v;
      });
      return this.problemPouch.addProblems(success);
    })
    .then(result => {
      // console.log("successfully stored problems in the database", result);
      return this.problemPouch.db.allDocs({include_docs:true})
    })
    .then((result) => {
      // handle result
      // console.log('AllDocs Retrieved For Use Did Init!', result);
    })
    .catch(err => {
      console.error(err);
      return this.problemPouch.db.allDocs({include_docs:true})
    })
    .then((result) => {
      console.log('AllDocs Retrieved From Storage!', result);
      // 1. Now populate all problems in app if offline.
      // 2. Sync DB if possible?
      // 3. Download problem images if on device, cache them on the device.

      // this.runImageDownloadService();


    })
    .catch(err => {
      console.error(err);
    });

    this.userPouch.init()
    .then(()=>{
      console.log('User Private PouchDB READY!');
      return this.userPouch.db.allDocs({ include_docs: true });
    })
    .then((result) => {
      // handle result
      console.log('AllDocs Check!', result);
      if (result.rows.length>0) {
        // Need to update user info in db on connection to server
        throw new Error('User Private PouchDB previously initialized.');
      } else{
        // Need to add user info to db on login
      }
    })
    .catch(err => {
      console.error(err);

      return this.userPouch.db.allDocs({include_docs:true})
    })
    .then((docs)=> {
      console.log('Users docs: ', docs.length)
    })
  }

  runImageDownloadService() {
    if (this.platform.is('core')) {
      console.log('Bypassing Image Download Service on Browser...');

    } else{
      console.log('is Device');
    }
  }


  initPushNotifications() {
    var push = Push.init({
       android: {
           senderID: '355474356370'
       },
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       },
       windows: {}
    });

    console.log(JSON.stringify(push));
    // push.hasPermission()
    // .then((conf)=>{
    //   console.log("Push: ",conf);
    // })
    // .catch(err=>{
    //   console.error("Push Error: ", err);
    // })

    push.on('notification', function(data) {
      // Received Notification
      console.log(data.message);
      console.log(data.title);
      console.log(data.count);
      console.log(data.sound);
      console.log(data.image);
      console.log(data.additionalData);

      push.finish(function() {
               console.log('success');
           }, function() {
               console.log('error');
           });
    });

    push.on('error', function(e) {
      // Error
        console.error(e.message);
    });

    push.on('registration', function(data) {
      // Did Register for notifications
        console.log("Registration Success: ", data.registrationId);
        // Save Registration ID to Local Storage
        var oldRegId = localStorage.getItem('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('registrationId', data.registrationId);

        }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //
    console.log('Open Page: ', page);
    this.menuCtrl.close();
    this.nav.setRoot(page.component);
    // this.nav.push(page.component, {});
  }

  openSignOutPage(page) {
    this.accountService.forget()
    .then(()=>{
      this.menuCtrl.close();
      this.nav.setRoot(page.component);
    })
  }

  editProfile() {
    this.nav.setRoot(EditProfile, {});
  }

  viewProfile() {
    this.nav.setRoot(Profile, {});
  }

  tappedProfileRight() {

  }

  tappedProfileLeft() {
  }

  tappedEditProfile() {
    //Open Profile Page
    this.nav.push(EditProfile, {});

  }

  leftMenuOpened() {
    if(this.authSrv.Profile){
      this.Profile = this.authSrv.Profile;
    }else{
      console.error('this.authSrv.Profile is undefined');
    }
    // console.log("opened");
  }

  leftMenuClosed() {
    // console.log("closed");

  }

  rightMenuClosed() {
    // Get Global Activity

  }

  rightMenuOpened(){
    // Get Global Activity
    this.getGlobalActivityFeed();
  }

  getGlobalActivityFeed() {
    this.authSrv.getGlobalActivityFeed()
    .then((success: any[]) => {
      this.globalActivity = [];
      success.forEach((itm, idx) => {
        this.globalActivity.unshift(itm);
      });
    })
    .catch((err)=>{
      console.error(err);
    })

    this.authSrv.globalActivityService$
    .subscribe(activity => {
      console.log("globalActivityService$ ", activity.length);
      this.globalActivity = [];
      activity.forEach((itm, idx) => {
        this.globalActivity.unshift(itm);
      });
    }, err => {
      console.error(err);
    })
  }

  tappedItemInHistory(item: any) {
    console.log('tappedItemInHistory', item);
    this.nav.push(ProfilePublic, { activeItem: item });
  }

}
