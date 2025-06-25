export class NotificationFilterRequestDto {

    constructor() {
        this.userId = '';
        this.name = '';
        this.content = "";
        this.isActive = true;
    }
    public userId: string;
    public name: string;
    public content: string;
    public isActive: boolean;
}

export class NotificationRequestDto {

    constructor() {
        this.userId = '';
        this.type = '';
        this.messaage = '';
        this.seen = true;
        this.isActive = true;
        this.remarks = "";
    }
    public userId?: string;
    public type: string;
    public messaage: string;
    public remarks: string;
    public seen: boolean;
    public isActive: boolean;
}
