export class BookingRescheduleFilterRequestDto {
     constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate =new Date();
        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public isActive: boolean;
}

export class BookingRescheduleRequestDto {

    constructor() {
        this.bookingId = 0;
        this.oldClassDate =new Date();
        this.newClassDate =new Date();
        this.reason = "";
        this.isActive = true;
        this.remarks = "";
    }
    public bookingId: number;
    public oldClassDate: Date;
    public newClassDate: Date;
    public reason: string;
    public remarks: string;
    public isActive: boolean;
}