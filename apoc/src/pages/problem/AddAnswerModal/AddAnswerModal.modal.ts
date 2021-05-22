import {Component} from '@angular/core';
import { ActionSheetController, Platform, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ImagePicker, MediaCapture, CaptureError, CaptureImageOptions, File } from 'ionic-native';

// Providers
import { AuthService } from '../../../providers/auth-service';
import { AwsS3 } from '../../../providers/aws-s3';

@Component({
	templateUrl: 'AddAnswerModal.modal.html'
})

export class AddAnswerModal {
	activeProblem: any;
	activeAnswer: any;

	constructor(public platform: Platform,
							public params: NavParams,
							public viewCtrl: ViewController,
							public loadingCtrl: LoadingController,
							public actionSheetCtrl: ActionSheetController,
							public authSrv: AuthService,
							public awsUtil: AwsS3) {
	    this.activeAnswer = params.data.comment;
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
			        console.log(success);
			        console.log("File Exists");
							let loader = this.loadingCtrl.create({
					      content: "Uploading Image Please Wait..."
					    });
					    loader.present();

			        File.readAsDataURL(readDir, readFile)
			          .then((success) => {
			            // success
			            console.log("gotBase64, now upload!");
									this.awsUtil.s3JPGUpload(success)
									.then((success: any) => {
										console.log(success);
										loader.dismiss();
										let tmpImage = { image_url: success.awsdata.Location };
										this.activeAnswer.images.unshift(tmpImage);
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
		    },
		    (err: CaptureError) => console.error(err)
		  );
	}

	getImageFromLibrary(){
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
									let tmpImage = {image_url: success.awsdata.Location};
									this.activeAnswer.images.unshift(tmpImage);
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
			console.log(this.activeAnswer.images);
		}, (err) => {
			console.error(err);
		});
	}

	tappedAddImages(){
		//Show Action Sheet
		let actionSheet = this.actionSheetCtrl.create({
		  title: 'Attach Images',
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

	dismiss() {
		this.viewCtrl.dismiss(this.params);
	}

	tappedCancelComment() {
		this.viewCtrl.dismiss();
	}

	submitAnswerComment() {
		console.log("submitAnswer", this.activeAnswer);

		if(this.activeAnswer.body.length != 0 || this.activeAnswer.images.length != 0){
			//New CommentResource
			this.viewCtrl.dismiss(this.params);
		}else{
			console.log('invalid comment, unable to save.');
		}

	}

	tappedRemoveImage(image, $index) {
		this.activeAnswer.images.splice($index, 1);
	}

}
