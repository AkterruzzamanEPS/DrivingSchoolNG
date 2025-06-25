export class PaymentFilterRequestDto {

 constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.packageId = 0;
        this.status = 1;

        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public packageId: number;
    public status: number;
    public isActive: boolean;
}

export class PaymentRequestDto {

    constructor() {
        this.userId = "";
        this.paymentMethod = "";
        this.packageId = 0;
        this.amount = 0;
        this.status = 0;
        this.transactionDate = new Date();

        this.isActive = true;
        this.remarks = "";
    }
    public userId: string;
    public paymentMethod: string;
    public packageId: number;
    public amount: number;
    public status: number;
    public transactionDate: Date;
    public remarks: string;
    public isActive: boolean;
}

