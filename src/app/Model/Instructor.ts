export class InstructorFilterRequestDto {

    constructor() {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.isActive = true;
    }
    public name: string;
    public email: string;
    public phone: string;
    public isActive: boolean;
}

export class InstructorRequestDto {

    constructor() {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.userId = '';
        this.licenseNumber = '';
        this.yearsOfExperience = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public email: string;
    public phone: string;
    public address: string;
    public userId: string;
    public licenseNumber: string;
    public yearsOfExperience: number;
    public remarks: string;
    public isActive: boolean;
}
