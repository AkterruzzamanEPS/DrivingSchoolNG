export class SlotAssignmentFilterRequestDto {

    constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate =new Date();
        this.instructorId = 0;
        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public instructorId: number;
    public isActive: boolean;
}

export class SlotAssignmentRequestDto {

    constructor() {
        this.slotId = 0;
        this.instructorId = 0;
        this.availableDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public slotId: number;
    public instructorId: number;
    public availableDate: Date;
    public remarks: string;
    public isActive: boolean;
}

