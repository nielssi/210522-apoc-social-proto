import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// pages
import { BrowseInterPage } from '../browse-inter/browse-inter'

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
  selector: 'page-browse-modifiers',
  templateUrl: 'browse-modifiers.html',
})
export class BrowseModifiersPage {

  activeCategoryData: any;
  filterQuery = "";
  filteredItems: any;
  modifiers = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if (this.navParams.get('activeCategoryData')) {
      this.activeCategoryData = this.navParams.get('activeCategoryData');
      this.modifiers = this.activeCategoryData.modifiers;
      this.filteredItems = this.modifiers;
    } else {
      // prevents page from not loading
      this.activeCategoryData = {"name": "Loading error..."};
    }

  }

  ionViewDidLoad() {
    console.log("hello browse modifiers");
  }

  tappedInter(modifier){
    console.log("Navigate to browse - intermediates page");
    this.navCtrl.push(BrowseInterPage, { activeModifierData: modifier });
  }

  filterItems(ev){
    var val = ev.target.value
    console.log(val);
    if(val){
      this.filteredItems = new BrowseSearchPipe().transform(this.modifiers, this.filterQuery);
    }else{
      this.filteredItems = this.modifiers;
    }
  }
}

