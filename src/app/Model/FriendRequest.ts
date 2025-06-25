export class FriendRequestFilterRequestDto {

    constructor() {
        this.name = '';
        this.fromUserId = '';
        this.toUserId = '';
        this.status = 0;
        this.isActive = true;
    }
    public name: string;
    public fromUserId: string;
    public toUserId: string;
    public status: number;
    public isActive: boolean;
}


export class FriendRequestRequestDto {

    constructor() {
        this.fromUserId = '';
        this.toUserId = '';
        this.status = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public fromUserId?: string;
    public toUserId: string;
    public status: number;
    public isActive: boolean;
    public remarks: string;
}
