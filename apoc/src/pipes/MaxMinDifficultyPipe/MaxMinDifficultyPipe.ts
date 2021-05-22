import {Pipe, PipeTransform} from '@angular/core';

// Tell Angular2 we're creating a Pipe with TypeScript decorators

@Pipe({
  name: 'MaxMinDifficultyPipe'
})
export class MaxMinDifficultyPipe  implements PipeTransform  {

  // Transform is the new "return function(value, args)" in Angular 1.x
  transform(value, difficultyRange?) {
    // ES6 array destructuring

    return value.filter(item => {
    	var shouldReturn = true;
      if(item.difficulty > difficultyRange.upper || item.difficulty < difficultyRange.lower){
        shouldReturn = false;
      }
      return shouldReturn
    });
  }
}