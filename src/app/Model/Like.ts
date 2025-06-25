export class LikeFilterRequestDto {

    constructor() {
        this.userId = '';
        this.name = '';
        this.postId = 0;
        this.isActive = true;
    }
    public userId: string;
    public name: string;
    public postId: number;
    public isActive: boolean;
}

export class LikeRequestDto {

    constructor() {
        this.userId = '';
        this.name = '';
        this.postId = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public userId?: string;
    public name: string;
    public remarks: string;
    public postId: number;
    public isActive: boolean;
}