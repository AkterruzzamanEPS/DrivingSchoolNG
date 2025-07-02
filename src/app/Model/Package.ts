export class PackageFilterRequestDto {

    constructor() {
        this.name = '';
        this.isActive = true;
    }
    public name: string;
    public isActive: boolean;
}

export class PackageRequestDto {

    constructor() {
        this.name = '';
        this.description = '';
        this.price = 0;
        this.totalLessons = 0;
        this.rate = 0;
        this.fileId = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public description: string;
    public price: number;
    public totalLessons: number;
    public rate: number;
    public fileId: number;
    public remarks: string;
    public isActive: boolean;
}