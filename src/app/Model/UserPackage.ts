export class UserPackageFilterRequestDto {

    constructor() {
        this.name = '';
        this.packageId = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.paymentStatus = 0;
        this.isActive = true;
    }
    public name: string;
    public packageId: number;
    public startDate: Date;
    public endDate: Date;
    public paymentStatus: number;
    public isActive: boolean;
}

export class UserPackageRequestDto {

    constructor() {
        this.userId = "";
        this.packageId = 0;
        this.paymentStatus = 0;
        this.purchaseDate = new Date();
        this.expiryDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public userId: string;
    public packageId: number;
    public paymentStatus: number;
    public purchaseDate: Date;
    public expiryDate: Date;
    public remarks: string;
    public isActive: boolean;
}