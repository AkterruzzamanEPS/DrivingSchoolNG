export class PackageFilterRequestDto {

    constructor() {
        this.name = '';
        this.isActive = true;
    }
    public name: string;
    public isActive: boolean;
}

export class RegistrationRequestDto {

    constructor() {
        this.fullName = "";
        this.userName = "";
        this.email = "";
        this.gender = "";
        this.address = "";
        this.postalCode = "";
        this.learningStage = 0;
        this.fileId = 0;
        this.vehicleType = 0;
        this.type = 0;
        this.packageId = 0;
        this.bookingId = 0;
        this.nooflesson = 0;
        this.lessonRate = 0;
        this.netAmount = 0;
        this.amount = 0;
        this.paymentAmount = 0;
        this.discount = 0;
        this.isFixed = false;
        this.paymentMethod = "";
        this.phoneNumber = "";
        this.dateOfBirth = new Date();
        this.password = "";
        this.confirmPassword = "";
    }
    public fullName: string;
    public userName: string;
    public email: string;
    public gender: string;
    public address: string;
    public postalCode: string;
    public learningStage: number;
    public fileId: number;
    public vehicleType: number;
    public type: number;
    public isFixed: boolean;
    public packageId: number;
    public bookingId: number;
    public nooflesson: number;
    public lessonRate: number;
    public amount: number;
    public paymentAmount: number;
    public discount: number;
    public netAmount: number;
    public paymentMethod: string;
    public phoneNumber: string;
    public dateOfBirth: Date;
    public password: string;
    public confirmPassword: string;
}

