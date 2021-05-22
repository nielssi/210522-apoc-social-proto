import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// Services
import { AppSettings } from './app-settings';

declare let AWS: any;
declare let chance: any;

@Injectable()
export class AwsS3 {
  public appSettings: AppSettings = new AppSettings();
  private region = '';
  private bucket = '';

  constructor() {
    AWS.config.region = this.appSettings.aws.apoc_app.region;
    AWS.config.update({
     accessKeyId: this.appSettings.aws.apoc_app.acces_key_id,
     secretAccessKey: this.appSettings.aws.apoc_app.secret_access_key
    });
    this.bucket = this.appSettings.aws.apoc_app.bucket;
    this.region = this.appSettings.aws.apoc_app.region;

  }

  public s3JPGUpload (data: any) {
    let bucket = new AWS.S3({params: {Bucket: this.bucket}});
    let now = new Date().toISOString();
    let suffix = chance.string({length: 10, pool: 'abcdefghijklmnopqrstuvwxyz1234567890'});
    // Decode Image
    let str = data.replace(/^data:image\/\w+;base64,/, '');
    let blob = this.b64toBlob(str, 'image/jpeg');

    let file_name = now + '_' + suffix + '.jpg';
    let putparams = {
        ACL: 'public-read',
        Bucket: this.bucket,
        Key: file_name,
        ContentType: 'image/jpeg',
        Body: blob
    };

    return new Promise((resolve, reject) => {
      bucket.upload(putparams, function(err, awsdata) {
        if (err) {
          reject(err);
        }else {
          resolve({file: file_name, awsdata: awsdata});
        }
      });

      bucket.listMultipartUploads({Bucket: this.bucket}, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        console.log("s3JPGUpload IS IN PROGRESS");
      });
    });
  }

  private b64toBlob(b64Data: any, contentType: string, sliceSize?) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      let byteCharacters = atob(b64Data);
      let byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);

          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          let byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

      let blob = new Blob(byteArrays, {type: contentType});
      return blob;
  }

}
