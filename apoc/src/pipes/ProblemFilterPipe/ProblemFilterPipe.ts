import {Pipe, PipeTransform} from '@angular/core';

// Tell Angular2 we're creating a Pipe with TypeScript decorators

@Pipe({
  name: 'problemKeywordFilterPipe'
})
export class ProblemFilterPipe implements PipeTransform{

  
  transform(value, keywords) {

    if(keywords.length==0){
      return value
    }else{

      return value.filter(item => {
        var shouldReturn = false;
        keywords.forEach(function(keyword, idx){
          if(item.text.indexOf(keyword) > -1){
            item.text = item.text.replace(keyword, "<strong>"+keyword+"</strong>");
            // item.text.replace(new RegExp('('+keyword+')', 'gi'),'<span class="highlighted" [html]=$1></span>')

            shouldReturn = true;
            item.keywords.push(keyword);
          }  
        })
        return shouldReturn;
      });      
    }
  }
}