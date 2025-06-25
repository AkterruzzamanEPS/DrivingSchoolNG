export class AspNetUsersFilterRequestDto {
    constructor() {
        this.name = '';
        this.type = 0;
        this.isActive = true;
    }
    public type: number;
    public name: string;
    public isActive: boolean;
}

export class AspNetUsersRequestDto {

    constructor() {
        this.fullName = "";
        this.email = "";
        this.phoneNumber = '';
        this.password = '';
        this.confirmPassword = '';
        this.type = 0;
        this.firstName = "";
        this.lastName = "";
        this.gender = "";
        this.userName = "";
        this.dateOfBirth = new Date();
        this.packageId = 0;
        this.amount = 0;
    }
    public fullName: string;
    public email: string;
    public phoneNumber: string;
    public password: string;
    public confirmPassword: string;
    public type: number;
    public firstName: string;
    public lastName: string;
    public gender: string;
    public userName: string;
    public dateOfBirth: Date;
    public packageId: number;
    public amount: number;
}