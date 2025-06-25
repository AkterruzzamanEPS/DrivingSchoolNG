export class PostFilterRequestDto {

    constructor() {
        this.startDate =new Date();
        this.endDate = new Date();
        this.categoryId = 0;
        this.parentId = 0;
        this.name = '';
        this.content = "";
        this.isActive = true;
    }
    public startDate: Date;
    public endDate: Date;
    public categoryId: number;
    public parentId: number;
    public name: string;
    public content: string;
    public isActive: boolean;
}

export class PostRequestDto {

    constructor() {
        this.categoryId = 0;
        this.parentId = 0;
        this.shortName = '';
        this.name = '';
        this.content = '';
        this.fileId = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public categoryId: number;
    public parentId: number;
    public shortName: string;
    public name: string;
    public content: string;
    public remarks: string;
    public fileId: number;
    public isActive: boolean;
}