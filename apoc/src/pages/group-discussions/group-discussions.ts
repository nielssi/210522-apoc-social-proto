import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the GroupDiscussions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-group-discussions',
  templateUrl: 'group-discussions.html'
})
export class GroupDiscussions {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello GroupDiscussions Page');
  }

}
