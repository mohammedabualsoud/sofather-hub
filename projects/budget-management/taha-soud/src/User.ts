class User {
    private _userName: string;
    private _firstName: string;
    private _lastName: string;
    private _balance: number;

    constructor(userName: string, firstName: string, lastName: string, balance: number) {
        this._userName = userName;
        this._firstName = firstName;
        this._lastName = lastName;
        this._balance = balance;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get balance(): number {
        return this._balance;
    }

    set balance(value: number) {
        if (value < 0) {
            throw new Error('Balance cannot be negative');
        }
        this._balance = value;
    }
}

export default User;
