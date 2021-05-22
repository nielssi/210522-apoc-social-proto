import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

// Pages
import { Problem } from '../problem/problem';
import { Problems } from '../../providers/problems';
//import * as data from '../../assets/dummyData.json';
/**
 * Generated class for the BrowseCategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-browse-problems',
  templateUrl: 'browse-problems.html',
})
export class BrowseProblemsPage {

  activeInterData: any;
  reallyAllProblems = [];
  problems = [];
  // full data of problem to be loaded in this
  problemsFull: any = [];
  problem;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public problemsRes: Problems) {
    this.loadProblems();
  }

  loadProblems() {

    if(this.navParams.get('activeInterData')) {
      this.activeInterData = this.navParams.get('activeInterData');
      this.problems = this.activeInterData.problems;
      this.problemsRes.allProblems().then((success: any[]) => {
        this.reallyAllProblems = success;
        this.problems.forEach((element1) => {
          this.reallyAllProblems.forEach((element2, index) => {
            //console.log("globalproblem id xxxy -- --           - -           --      --> ");
            if (element1.globalProblemId === element2.globalProblemId) {
              //this.problemsFull.push = element2._id;
              this.problemsFull.push(element2);
            }
            //console.log("element 1 globabl: ", JSON.stringify(element1.globalProblemId));
            //console.log("element 2 globabl: ", JSON.stringify(element2.globalProblemId));
          });
        });
        //console.log("problemsFull ", JSON.stringify(this.problemsFull));
      }).catch((err) => {
        console.log("Error getting all problems: ", JSON.stringify(err));
      });

    } else {
      this.activeInterData = {"name": "Loading..."};
    }

  }


  ionViewDidLoad() {
    console.log("hello browse problems");
  }

  tappedProblem(problem){

    this.navCtrl.push(Problem, {activeProblem: problem});

  }

  getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {

      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    }else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
  }

}
