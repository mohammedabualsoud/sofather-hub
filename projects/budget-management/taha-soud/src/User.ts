class User{
    userName:string;
    firstName:string;
    lastName:string;
    balance:number;
    constructor(userName:string,firstName:string,lastName:string,balance:number) {
        this.userName=userName;
        this.firstName=firstName;
        this.lastName=lastName;
        this.balance=balance;
    }
}
export default User;