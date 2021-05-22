import {Pipe, PipeTransform} from '@angular/core';

// Tell Angular2 we're creating a Pipe with TypeScript decorators

@Pipe({
  name: 'problemKeywordFilterPipe'
})
export class BrowseSearchPipe implements PipeTransform {
  transform(elements: any[], query: String): any[] {
    // elements is an array of objects, pipe assumes that each object has a elements[0].name attibute that is a string.
    if(query.length>2){
      var filteredArr: any[] = elements.filter((element, idx) => {
        return (element.name.toLowerCase().indexOf(query.toLowerCase())>-1)
      });
      return filteredArr
    }else{
      return elements
    }
  }
}
