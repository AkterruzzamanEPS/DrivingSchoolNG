export class VehicleFilterRequestDto {

    constructor() {
        this.model = "";
        this.registrationNumber = "";
        this.fuelType = 0;
        this.transmissionType = 0;
        this.status = 0;
        this.isActive = true;
    }
    public model: string;
    public registrationNumber: string;
    public fuelType: number;
    public transmissionType: number;
    public status: number;
    public isActive: boolean;
}

export class VehicleRequestDto {

    constructor() {
        this.make = "";
        this.model = "";
        this.year = 0;
        this.registrationNumber = "";
        this.color = "";
        this.fuelType = 0;
        this.transmissionType = 0;
        this.status = 0;
        this.lastServicedAt = new Date();
        this.insuranceExpiryDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public make: string;
    public model: string;
    public year: number;
    public registrationNumber: string;
    public color: string;
    public fuelType: number;
    public transmissionType: number;
    public status: number;
    public lastServicedAt: Date;
    public insuranceExpiryDate: Date;
    public remarks: string;
    public isActive: boolean;
}
