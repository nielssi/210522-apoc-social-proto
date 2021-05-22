export class UserSignUp {
  constructor(
  	   public name:  string,
  	   public email:  string,
  	   public password:  string,
  	   public confirm?: string,
  	   public type?: string,
  	   public rememberMe?: boolean
  ) {

  }
}
