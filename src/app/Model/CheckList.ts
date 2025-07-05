import { Time } from "@angular/common";

export class CheckListFilterRequestDto {

    constructor() {
        this.name = '';
        this.isActive = true;
    }
    public name: string;
    public isActive: boolean;
}


export class CheckListRequestDto {

    constructor() {
        this.name = '';
        this.description = "";
        this.fileId = 0;
        this.weight = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public description: string;
    public fileId: number;
    public weight: number;
    public remarks: string;
    public isActive: boolean;
}



