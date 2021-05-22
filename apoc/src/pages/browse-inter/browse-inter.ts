import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// pages
import { BrowseProblemsPage } from '../browse-problems/browse-problems'

// pipes
import { BrowseSearchPipe } from '../../pipes/BrowseSearchPipe/browse-search.pipe';
//import * as data from '../../assets/dummyData.json';
/**
 * Generated class for the BrowseCategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-browse-inter',
  templateUrl: 'browse-inter.html',
})
export class BrowseInterPage {

  activeModifierData: any;
  filterQuery = "";
  filteredItems: any;
  inters = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if (this.navParams.get('activeModifierData')) {
      this.activeModifierData = this.navParams.get('activeModifierData');
      this.inters = this.activeModifierData.intermediates;
      this.filteredItems = this.inters;
    } else {
      // prevents page from not loading
      this.activeModifierData = {"name": "Loading error..."};
    }

  }

  ionViewDidLoad() {
    console.log("hello browse intermediates");
  }

  tappedProblem(inter){
    console.log("Navigate to browse - intermediates page");
    this.navCtrl.push(BrowseProblemsPage, { activeInterData: inter });
  }

  filterItems(ev){
    var val = ev.target.value
    console.log(val);
    if(val){
      this.filteredItems = new BrowseSearchPipe().transform(this.inters, this.filterQuery);
    }else{
      this.filteredItems = this.inters;
    }
  }

}

