import { Time } from "@angular/common";

export class ExpenditureHeadFilterRequestDto {

    constructor() {
        this.name = '';
        this.isActive = true;
    }
    public name: string;
    public isActive: boolean;
}


export class ExpenditureHeadRequestDto {

    constructor() {
        this.name = '';
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public remarks: string;
    public isActive: boolean;
}



