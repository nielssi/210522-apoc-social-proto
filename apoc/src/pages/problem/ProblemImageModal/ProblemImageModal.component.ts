import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams, NavController, LoadingController, Loading, MenuController, Platform } from 'ionic-angular';
import { AppSettings } from '../../../providers/app-settings';

@Component({
	templateUrl: 'ProblemImageModal.component.html'
})

export class ProblemImageModal {
	activeProblem : any;
	assetUrlPrefix: string;
	assetUrlSuffix: string;
	constructor(private params: NavParams, public platform: Platform, private viewCtrl: ViewController) {
		this.assetUrlPrefix = new AppSettings().SERVER_URL+"/assets/images/problems/";
		this.assetUrlSuffix = "_Q.png";
		this.initActiveProblem();
	}
	initActiveProblem(){
		this.activeProblem = this.params.get('activeProblem');
		console.log(this.activeProblem);
	}
	close() {
		this.viewCtrl.dismiss();
	}

	getAssetUrl(gp_id){
		return this.assetUrlPrefix+gp_id+this.assetUrlSuffix;
	}

	getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {

      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    }else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
	}
}
