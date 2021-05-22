import { Resource, ResourceParams } from "ng2-resource-rest";
import { Injectable } from "@angular/core";
// import { Observable }     from 'rxjs/Observable';
import { AppSettings } from "../../app-settings";

@Injectable()
@ResourceParams({
    url: new AppSettings().API_PATH,
    path: '/Categorys/{id}',
    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})

export class Category extends Resource {

}

/**
	Documentation for using ng2-resource-rest resources may be found here:
	https://github.com/troyanskiy/ng2-resource-rest
*/
