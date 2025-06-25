export class AttendanceFilterRequestDto {

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

export class AttendanceRequestDto {

    constructor() {
        this.bookingId = 0;
        this.attended = true;
        this.markBy = '';
        this.markDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public bookingId: number;
    public attended: boolean;
    public markBy: string;
    public markDate: Date;
    public remarks: string;
    public isActive: boolean;
}
