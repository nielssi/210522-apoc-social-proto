import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';

// PouchBD
import { ProblemPouch } from  '../pouches/problem.pouch';
declare var cordova: any;

@Injectable()
export class ImageService {
  private imageDownloadService = new Subject<any>();
  public imageDownloadService$ = this.imageDownloadService.asObservable();
  private fileTransfer: FileTransferObject

  constructor(public platform: Platform,
              public problemPouch: ProblemPouch,
              private transfer: FileTransfer, private file: File) {
      this.fileTransfer = this.transfer.create();

  }

  public runImageDownloadService() {
    console.log('runImageDownloadService() is it working?');
    this.loadProblems()
    .then((result: any) => {
      result.rows.forEach((p, index) => {
        // Download p.image_url
        // console.log('ready to download : -', JSON.stringify(p));
      });
    });
    return this.imageDownloadService$;
  }

  public loadProblems() {
    return this.problemPouch.db.allDocs({include_docs:true});
  }
  //
  public download(url: string) {
    this.fileTransfer.download(url, cordova.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
  }

}
