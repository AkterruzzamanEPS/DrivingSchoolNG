import { Time } from "@angular/common";

export class SlotFilterRequestDto {

    constructor() {
        this.name = '';
        this.startTime = ""
        this.endTime = ""
        this.isActive = true;
    }
    public name: string;
    public startTime: string;
    public endTime: string;
    public isActive: boolean;
}


export class SlotRequestDto {

    constructor() {
        this.name = '';
        this.startTime = ""
        this.endTime = ""
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public remarks: string;
    public startTime: string;
    public endTime: string;
    public isActive: boolean;
}



