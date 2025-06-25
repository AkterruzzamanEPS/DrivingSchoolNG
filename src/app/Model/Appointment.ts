export class AppointmentFilterRequestDto {

    constructor() {
        this.name = '';
        this.slotId = 0;
        this.instructorId = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.status = 0;
        this.isActive = true;
    }
    public name: string;
    public slotId: number;
    public instructorId: number;
    public startDate: Date;
    public endDate: Date;
    public status: number;
    public isActive: boolean;
}

export class AppointmentRequestDto {

    constructor() {
        this.userId = '';
        this.slotId = 0;
        this.instructorId = 0;
        this.status = 0;
        this.requestedAt = new Date();
        this.approvedBy = "";
        this.isActive = true;
        this.remarks = "";
    }
    public userId: string;
    public slotId: number;
    public instructorId: number;
    public status: number;
    public requestedAt: Date;
    public approvedBy: string;
    public remarks: string;
    public isActive: boolean;
}
