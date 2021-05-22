import { Component } from '@angular/core';
import { ViewController, ToastController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { AuthService } from '../../../providers/auth-service';

@Component({
	templateUrl: 'PasswordResetModal.component.html'
})

export class PasswordResetModal {
	showSubmitResetPasswordForm = false;
	passwordResetData = {
		email: '',
		password: '',
		token: ''
	}
	constructor(params: NavParams, private viewCtrl: ViewController,
							private authService: AuthService,
							public toastCtrl: ToastController) {

	}
	close() {
		this.viewCtrl.dismiss();
	}
	togglePasswordResetForms(){
		this.showSubmitResetPasswordForm = !this.showSubmitResetPasswordForm;
	}
	requestNewPasswordWithToken(form){
		console.log("requestNewPasswordWithToken", form.value);
		if(form.form._status=="VALID"){

			this.authService.requestNewPasswordWithToken(form.value)
			.then((success: any)=>{
				console.log(success);
				let toast = this.toastCtrl.create({
				  message: success.message,
				  duration: 2100
				});
				toast.present();
				this.close()
			})
			.catch(err=>{
				console.log(err);
				let toast = this.toastCtrl.create({
				  message: err,
					duration: 2100
				});
				toast.present();
			})
		}else{
			console.log("Form is invalid");
		}
	}
	submitPasswordResetForm(form) {
		console.log("submitPasswordResetForm");
		console.log(form.value)
		if(form.form._status=="VALID"){
			this.authService.requestPasswordReset(form.value)
			.then((success: any)=>{
				console.log(success);
				let toast = this.toastCtrl.create({
				  message: success.message,
					duration: 2100
				});
				toast.present();
			})
			.catch(err=>{
				console.log(err);
				let toast = this.toastCtrl.create({
				  message: err.message,
					duration: 2100
				});
				toast.present();
			})
		}else{
			console.log("Form is invalid");
		}
	}
}
