import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ImagePicker, MediaCapture, CaptureError, CaptureImageOptions, File } from 'ionic-native';
//Services
import { AuthService } from '../../providers/auth-service';
import { AwsS3 } from '../../providers/aws-s3';

/*
  Generated class for the EditProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfile {
  public userProfile: any;

  constructor(public navCtrl: NavController,
              private authSrv: AuthService,
              private loadingCtrl: LoadingController,
              public actionSheetCtrl: ActionSheetController,
              public awsUtil: AwsS3) {
    this.userProfile = authSrv.Profile;
  }

  ionViewDidLoad() {
    console.log('Hello EditProfile Page');
    console.log(this.userProfile);
  }

  tappedUpdateProfile() {
    this.showLoadingMessage("Just a moment while we save your changes.", 800);
    this.authSrv.updateProfile(this.userProfile)
    .then((success)=>{
        console.log(success);
        // Show Success Message
        this.showLoadingMessage("Your profile has been updated successfully.", 1500);
    });
  }

  showLoadingMessage(message, duration) {
    let loader = this.loadingCtrl.create({
      content: message,
      duration: duration,
      dismissOnPageChange: false
    });
    loader.present();
  }

  updateProfilePhoto(url: string){
    this.authSrv.Profile.avatar = url;
    this.userProfile.avatar = url;
    this.authSrv.updateProfilePhoto(url)
    .then(u => {
      console.log('profile photo saved', u);
    })
    .catch(err => {
      console.log(err);
    });
  }

	getImageFromCamera(){
		let options: CaptureImageOptions = { limit: 1 };
		MediaCapture.captureImage(options)
		  .then(
		    (data: any) => {
		    	console.log("Got media from camera.", JSON.stringify(data));
		    	let image = "data:image/jpeg;base64," + data;
					let tmpUrl = data[0].fullPath
					// Check that file exists

					if(tmpUrl.indexOf('file://')==-1){
			      console.log("Adding file:// prefix");
			      tmpUrl = 'file://'+tmpUrl
			      console.log(tmpUrl)
			    }
			    // READ
			    var readFileArr = tmpUrl.split('/');
			    var readFile = readFileArr[readFileArr.length-1];
			    var readDir = tmpUrl.replace(readFile, '');

			    console.log('File: ', readFile);
			    console.log('Directory: ', readDir);

					// Read Image from url
					File.checkFile(readDir, readFile)
			      .then((success) => {
			        // success
							let loader = this.loadingCtrl.create({
					      content: "Uploading Image Please Wait..."
					    });
					    loader.present();

			        File.readAsDataURL(readDir, readFile)
			          .then((success) => {
			            // success
									this.awsUtil.s3JPGUpload(success)
									.then((success: any) => {
										console.log(success);
										loader.dismiss();
                    // Update Profile Photo
                    this.updateProfilePhoto(success.awsdata.Location);
									})
									.catch(err => {
										console.error('Problem uploading: ', JSON.stringify(err));
									});
			          }, (error) => {
			            // error
			            console.error('Problem reading file: ', error);
			          });
			      }, (error) => {
			        // error
							console.error('Problem checking file: ', error);
			      });
		    },
		    (err: CaptureError) => console.error(err)
		  );
	}

	getImageFromLibrary() {
		var options = {
			maximumImagesCount: 1,
		};
		ImagePicker.getPictures(options).then((results) => {
			for (var i = 0; i < results.length; i++) {
			  console.log('Image URI: ' + results[i]);
				let tmpUrl = results[i];

				// this.activeAnswer.images.unshift(tmpImage);
				// Check that file exists

				if(tmpUrl.indexOf('file://')==-1){
		      console.log("Adding file:// prefix");
		      tmpUrl = 'file://'+tmpUrl
		      console.log(tmpUrl)
		    }
		    // READ
		    var readFileArr = tmpUrl.split('/');
		    var readFile = readFileArr[readFileArr.length-1];
		    var readDir = tmpUrl.replace(readFile, '');

		    console.log('File: ', readFile);
		    console.log('Directory: ', readDir);

				// Read Image from url
				File.checkFile(readDir, readFile)
		      .then((success) => {
		        // success
		        console.log(success);
		        console.log("File Exists");
		        File.readAsDataURL(readDir, readFile)
		          .then((success) => {
		            // success
		            console.log("gotBase64, now upload!");
								let loader = this.loadingCtrl.create({
									content: "Uploading Image Please Wait..."
						    });
						    loader.present();

								this.awsUtil.s3JPGUpload(success)
								.then((success: any) => {
									console.log(success);
									loader.dismiss();
                  // Update profile photo
                  this.updateProfilePhoto(success.awsdata.Location);
								})
								.catch(err => {
									console.error(err);
								});
		          }, (error) => {
		            // error
		            console.error(error);
		          });
		      }, (error) => {
		        // error
						console.error(error);
		      });


			  console.log('Image URI: ' + results[i]);
			}
		}, (err) => {
			console.error(err);
		});
	}



  tappedEditProfilePhoto() {

    //Show Action Sheet
		let actionSheet = this.actionSheetCtrl.create({
		  title: 'Select Avatar Image',
		  buttons: [
		    {
		      text: 'Photo Library',
		      handler: () => {
		        console.log('Photo Library clicked');
		        this.getImageFromLibrary();
		      }
		    },{
		      text: 'Camera',
		      handler: () => {
		        console.log('Camera clicked');
		        this.getImageFromCamera();
		      }
		    },{
		      text: 'Cancel',
		      role: 'cancel',
		      handler: () => {
		        console.log('Cancel clicked');
		      }
		    }
		  ]
		});
		actionSheet.present();

  }

}
