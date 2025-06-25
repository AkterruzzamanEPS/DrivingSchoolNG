export class CategoryFilterRequestDto {

    constructor() {
        this.name = '';
        this.parentId = 0;
        this.isActive = true;
    }
    public name: string;
    public parentId: number;
    public isActive: boolean;
}

export class CategoryRequestDto {

    constructor() {
        this.name = '';
        this.parentId = 0;
        this.sequenceNo = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public remarks: string;
    public parentId: number;
    public sequenceNo: number;
    public isActive: boolean;
}

