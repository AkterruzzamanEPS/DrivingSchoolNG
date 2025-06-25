export class CommentFilterRequestDto {

    constructor() {
        this.userId = '';
        this.postId = 0;
        this.content = "";
        this.isActive = true;
    }
    public userId: string;
    public postId: number;
    public content: string;
    public isActive: boolean;
}

export class CommentRequestDto {

    constructor() {
        this.userId = '';
        this.postId =0;
        this.content = '';
        this.isActive = true;
        this.remarks = "";
    }
    public userId?: string;
    public postId: number;
    public content: string;
    public remarks: string;
    public isActive: boolean;
}