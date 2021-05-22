import { Directive } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true}]
})
export class EmailValidatorDirective implements Validator{

  validate(c: FormControl): {[key: string]: any} {
    var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var emailRegex = /.+@.+\..+/i;
    var isValidEmail = emailRegex.test(c.value);
    if(isValidEmail){
      return null;
      //Return null if there is no error.
    }else{
      return {"validEmail": isValidEmail};
    }

  }

}
