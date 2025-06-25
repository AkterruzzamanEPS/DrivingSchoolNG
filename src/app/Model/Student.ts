export class StudentFilterRequestDto {

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

export class StudentRequestDto {

    constructor() {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.userId = '';
        this.learningStage =0;
        this.dateOfBirth = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public email: string;
    public phone: string;
    public address: string;
    public userId: string;
    public learningStage: number;
    public dateOfBirth: Date;
    public remarks: string;
    public isActive: boolean;
}
