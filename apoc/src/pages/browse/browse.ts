import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Browse page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class Browse {
  filterQuery: string;
	categories:any[] = [];
  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Browse Page');
  }
  searchCategories(query){



	}
	clearCategorySearch(){
		this.filterQuery = '';
	}
}
