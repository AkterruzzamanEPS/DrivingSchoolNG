export class VehicleAvailabilityFilterRequestDto {

    constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate =new Date();
        this.vehicleId = 0;
        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public vehicleId: number;
    public isActive: boolean;
}

export class VehicleAvailabilityRequestDto {

    constructor() {
        this.slotId = 0;
        this.vehicleId = 0;
        this.availableDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public slotId: number;
    public vehicleId: number;
    public availableDate: Date;
    public remarks: string;
    public isActive: boolean;
}

