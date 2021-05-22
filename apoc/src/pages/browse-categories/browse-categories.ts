import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import * as data from '../../assets/dummyData.json';

// providers
import { CategoriesProvider } from '../../providers/categories.provider'

// pages
import { BrowseModifiersPage } from '../browse-modifiers/browse-modifiers'

// pipes
import { BrowseSearchPipe } from '../../pipes/BrowseSearchPipe/browse-search.pipe';

/**
 * Generated class for the BrowseCategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-browse-categories',
  templateUrl: 'browse-categories.html',
})
export class BrowseCategoriesPage {

  categories = [];
  filterQuery = "";
  insideJson = "";
  jsonData;
  categoriesIndexes = [];
  filteredItems = []


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public categoriesPrv: CategoriesProvider) {
    //const dummy = data;

  }

  ionViewDidLoad() {
    // this should load json every time browse is viewed
    this.getJson();

  }

  getJson(){
    this.categoriesPrv.query().then((success: any) => {
      this.categories = success;
      this.filteredItems = success;
      console.log('categoriesssss', this.categories);
      this.jsonData = success;

    }).catch((err) => {
      console.log("you caught an error ", JSON.stringify(err));
    });
  }

  tappedCategory(category){
    this.navCtrl.push(BrowseModifiersPage, { activeCategoryData: category });
  }

  filterItems(ev){
    var val = ev.target.value
    console.log(val);
    if(val){
      this.filteredItems = new BrowseSearchPipe().transform(this.categories, this.filterQuery);
    }else{
      this.filteredItems = this.categories
    }
  }

}
