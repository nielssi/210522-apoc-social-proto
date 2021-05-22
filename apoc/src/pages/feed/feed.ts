import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, MenuController, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { Storage } from '@ionic/storage';

// Providers
import { AppSettings } from '../../providers/app-settings';
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

// Resources
import { Problems } from '../../providers/problems';

// Pipes
import { ProblemFilterPipe } from '../../pipes/ProblemFilterPipe/ProblemFilterPipe';
import { MaxMinDifficultyPipe } from '../../pipes/MaxMinDifficultyPipe/MaxMinDifficultyPipe';

// Pages
import { Problem } from '../problem/problem';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class Feed extends SecurePage {
  allProblems: any[];
  reallyAllProblems: any[];
	filteredProblems: any[];
	activeKeywords: any[];
	assetUrlPrefix: string;
	assetUrlSuffix: string;
	filterQuery: string;
	featuredProblem: any = {
		contributor: '',
    comments: []
	};
	feedPage: number = 1;
	maxDifficulty: any = {
		lower: 0,
		upper: 10
	};

  constructor(public authSrv: AuthService,
          public nav: NavController,
          private problemsRes: Problems,
          public localStorage: Storage,
          public platform: Platform,
          private loadingCtrl: LoadingController, public menuCtrl: MenuController) {
    super(authSrv, nav);
		this.assetUrlPrefix = new AppSettings().SERVER_URL+"/assets/images/problems/";
		this.assetUrlSuffix = "_Q.png";
		this.activeKeywords = [];
		this.filteredProblems = [];
		this.filterQuery = '';

	}

  enableAuthenticatedMenu() {
    this.menuCtrl.enable(true, 'authenticated-left');
    this.menuCtrl.enable(true, 'authenticated-right');
  }

  ionViewDidLoad() {
    this.enableAuthenticatedMenu();
    this.initializeFeed();
  }

	doRefresh(refresher){
		this.initializeFeed(refresher);
	}

	initializeFeed(refresher?){
    this.problemsRes.query().then((success: any) => {
      this.allProblems = success;
      this.filterProblems();
      this.getFeaturedProblem();
      		if(refresher){
  					refresher.complete();
  				}
    });
    this.problemsRes.allProblems().then((success: any ) =>{
      console.log("All problems for real", success);
    })
	}

  getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {

      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    }else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
	}

	getAssetUrl(gp_id: number, problem?: any){
		return this.assetUrlPrefix+gp_id+this.assetUrlSuffix;
	}

	tappedProblem(problem){

		//Go to the problem screen.
    // this.nav.popToRoot();
    this.increaseProblemViews(problem);
		this.nav.push(Problem, {activeProblem: problem});

	}

	tappedClearKeywords(){
		this.activeKeywords = [];
		this.filterQuery = '';
		this.maxDifficulty = {
			lower: 0,
			upper: 10
		};
		this.filterProblems();
	}

	getFeaturedProblem(){
		// var featuredProblemId = Math.floor(Math.random() * this.allProblems.length)
		// this.featuredProblem = this.allProblems[featuredProblemId];
		// return this.featuredProblem
    this.problemsRes.allProblems().then((success: any) => {
      this.reallyAllProblems = success;
      console.log("this really all the problems length: ", this.reallyAllProblems.length);
      let featuredProblemId = Math.floor(Math.random() * this.reallyAllProblems.length);
      this.featuredProblem = this.reallyAllProblems[featuredProblemId];
      return this.featuredProblem

    }).catch((err) => {
      console.log("error getting really all the problems ", JSON.stringify(err));
    });
	}

	addKeyword(ev){
		var val = ev.target.value
		var dontAdd = false;
		if(val){
			val.trim();
			this.activeKeywords.forEach((item, idx) => {
				if(val.toLowerCase() == item.toLowerCase()){
					//Should not add to list of keywords
					dontAdd = true
				}else{
					//Check to see if
					if(idx==this.activeKeywords.length-1){
						if(val.includes(item)){
							//Removing last keyword due to matching substring.
							this.activeKeywords.splice(idx, 1)
						}
					}
				}
			})
			if(val.length > 2 && !dontAdd){
				this.activeKeywords.push(val);
			}else if(val.length < 2){

			}else{

			}
			this.filterProblems();
		}else{

		}
	}

	clearKeyword() {
		this.filterProblems();
	}

	removeKeyword(keyword) {
		this.activeKeywords.splice(this.activeKeywords.indexOf(keyword), 1);
		this.filterProblems();
	}

	filterProblems(){
		this.filteredProblems = new ProblemFilterPipe().transform(_.cloneDeep(this.allProblems), this.activeKeywords);
		//Check if user has bookmarked any problems, if so mark them
		this.didBookmarkProblems();
		//Check if user has completed any problems, if so mark them
		this.didCompleteProblems();
		//Send Query to Server
		if(this.activeKeywords.length>0){
			this.problemsRes.searchProblems({page: 0, count: 500})
			.then((results: any[]) => {
				if (results.length>0) {
					this.allProblems = results;
					this.filteredProblems = new ProblemFilterPipe().transform(_.cloneDeep(this.allProblems), this.activeKeywords);
					//Check if user has bookmarked any problems, if so mark them
					this.didBookmarkProblems();
					//Check if user has completed any problems, if so mark them
					this.didCompleteProblems();
				}
			});
		}
	}

	filterProblemsByDifficulty(difficulty){
		this.filteredProblems = new MaxMinDifficultyPipe().transform(_.cloneDeep(this.allProblems), difficulty);
	}

	doInfinite(infiniteScroll) {
		if(!(this.activeKeywords.length>0) || !(this.filterQuery.length>2 )){
			this.problemsRes.nextPage({page: this.feedPage})
			.then((results:any[])=>{
				// console.log("Get Paginated results complete", results);
				this.allProblems.push(...results);
				this.filterProblems();
				this.getFeaturedProblem();
				infiniteScroll.complete();
				this.feedPage++;
			})
      .catch(err => {
        console.error(err);
      })
		}else{
			infiniteScroll.complete();
		}

	}

	maxDifficultyDidChange(difficulty){
		this.filterProblemsByDifficulty(difficulty);

	}

	didBookmarkProblems(){
		this.filteredProblems.forEach((itm, idx)=>{
			if(this.authSrv.Profile.bookmarks.indexOf(itm._id)==-1){
				//Not Bookmarked
			}else{
				//Is Bookmarked
				itm.is_bookmarked = true;
			}
		})
	}

	didCompleteProblems(){
		this.filteredProblems.forEach((itm, idx)=>{
			if(this.authSrv.Profile.solvedProblems.indexOf(itm._id)==-1){
				//Not Complete
			}else{
				//Is Complete
				itm.is_solved = true;
			}
		})
	}

	tappedFeaturedProblem(problem){
		console.log(problem);
	}

  showLoadingMessage(message :string, duration :number, callback?): Loading{
		let loader = this.loadingCtrl.create({
			content: message,
			duration: duration,
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

  public increaseProblemViews(problem: any) {
    problem.views = problem.views + 1;
    this.problemsRes.increaseProblemViews(problem)
    .then(success => {
      console.log('increaseProblemViews: ', success);
    })
    .catch(err => {
      console.error('increaseProblemViews: ', err);
    })

  }

}
