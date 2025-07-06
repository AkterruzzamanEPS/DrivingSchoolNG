import { Time } from "@angular/common";

export class SlotFilterRequestDto {

    constructor() {
        this.name = '';
        this.date = new Date();
        this.startTime = ""
        this.endTime = ""
        this.isActive = true;
    }
    public name: string;
    public date: Date;
    public startTime: string;
    public endTime: string;
    public isActive: boolean;
}


export class SlotRequestDto {

    constructor() {
        this.name = '';
        this.date = new Date();
        this.startTime = ""
        this.endTime = ""
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public date: Date;
    public remarks: string;
    public startTime: string;
    public endTime: string;
    public isActive: boolean;
}



