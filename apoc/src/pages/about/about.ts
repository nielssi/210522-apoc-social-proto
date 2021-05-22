import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppVersion } from 'ionic-native';


/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class About {
  appName:any;
	packageName:any;
	versionCode:any;
	versionNumber:any;
  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('Hello About Page');
    AppVersion.getAppName()
    .then((res)=>{
      this.appName = res
    })
    .catch((err)=>{
      console.error(err);
    });

    AppVersion.getPackageName()
    .then((res)=>{
      this.packageName = res
    })
    .catch((err)=>{
      console.error(err);
    });

    AppVersion.getVersionCode()
    .then((res)=>{
      this.versionCode = res
    })
    .catch((err)=>{
      console.error(err);
    });

    AppVersion.getVersionNumber()
    .then((res)=>{
      this.versionNumber = res
    })
    .catch((err)=>{
      console.error(err);
    });
  }

  tappedCredit() {
    window.open('http://jspenc.software', '_blank', 'location=yes');

  }
}
