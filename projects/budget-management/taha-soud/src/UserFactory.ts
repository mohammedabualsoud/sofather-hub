import User from "./User"

class UserFactory{
    static createUser(userName:string,firstName:string,lastName:string,balance:number){
        return new User(userName,firstName,lastName,balance);
    }
}
export default UserFactory;