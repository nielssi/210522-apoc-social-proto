import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Explore page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html'
})
export class Explore {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Explore Page');
  }

}
