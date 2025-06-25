export class BookingFilterRequestDto {
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

export class BookingRequestDto {

    constructor() {
        this.studentId = 0;
        this.slotId = 0;
        this.instructorId = 0;
        this.vehicleId = 0;
        this.classDate = new Date();
        this.status = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public studentId: number;
    public slotId: number;
    public instructorId: number;
    public vehicleId: number;
    public classDate: Date;
    public status: number;
    public remarks: string;
    public isActive: boolean;
}
export class BookingAssignRequestDto {

    constructor() {
        this.userId = "";
        this.studentId = 0;
        this.packageId = 0;
        this.slotId = 0;
        this.instructorId = 0;
        this.vehicleId = 0;
        this.purchaseDate = new Date();
        this.expiryDate = new Date();
        this.packageStartDate = new Date();
        this.status = 0;
        this.isActive = true;
        this.remarks = "";
        this.slots = [];
    }
    public userId: string;
    public studentId: number;
    public slotId: number;
    public packageId: number;
    public instructorId: number;
    public vehicleId: number;
    public purchaseDate: Date;
    public expiryDate: Date;
    public packageStartDate: Date;
    public status: number;
    public remarks: string;
    public isActive: boolean;
    public slots:any[]
}


export class StudentResponseDto {
    constructor() {
        this.vehicleTypeName = "";
        this.learningStageName = "";
        this.packageName = "";
        this.description = "";
        this.packageId = 0;
        this.price = 0;
        this.totalLessons = 0;
        this.durationInDays = 0;
        this.name = "0";
        this.email = "0";
        this.phone = "";
        this.address = "";
        this.userId = "";
        this.dateOfBirth = new Date();
        this.learningStage = 0;
        this.fileId = 0;
        this.postalCode = "";
        this.vehicleType = 0;
        this.discount = 0.00;
        this.isFixed = false;
        this.id = 0;
        this.remarks = "";
        this.isActive = true;
        this.createdBy = "";
        this.createdDate = new Date();
        this.lastModifiedBy = "";
        this.lastModifiedDate = null;
    }
  
    public vehicleTypeName: string;
    public learningStageName: string;
    public packageName: string;
    public description: string;
    public price: number;
    public packageId: number;
    public totalLessons: number;
    public durationInDays: number;
    public name: string;
    public email: string;
    public phone: string;
    public address: string;
    public userId: string;
    public dateOfBirth: Date;
    public learningStage: number;
    public fileId: number;
    public postalCode: string;
    public vehicleType: number;
    public discount: number;
    public isFixed: boolean;
    public id: number;
    public remarks: string;
    public isActive: boolean;
    public createdBy: string;
    public createdDate: Date;
    public lastModifiedBy: string;
    public lastModifiedDate: Date | null;
}