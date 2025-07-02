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
        this.fileId = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public fileId: number;
    public remarks: string;
    public isActive: boolean;
}



