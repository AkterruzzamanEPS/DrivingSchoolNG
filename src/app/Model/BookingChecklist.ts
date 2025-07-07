export class BookingCheckListFilterRequestDto {
    constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public isActive: boolean;
}

export class BookingCheckListRequestDto {

    constructor() {
        this.bookingId = 0;
        this.checkListId = 0;
        this.checkListName = "";
        this.isActive = true;
        this.remarks = "";
    }
    public bookingId: number;
    public checkListId: number;
    public checkListName: string;
    public remarks: string;
    public isActive: boolean;
}

