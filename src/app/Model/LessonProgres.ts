export class LessonProgresFilterRequestDto {

    constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public isActive: boolean;
}

export class LessonProgresRequestDto {

    constructor() {
        this.bookingId = 0;
        this.status = 0;
        this.lessonTitle = "";
        this.feedback = "";
        this.progressPercentage = 0;
        this.addedBy = "";
        this.addedDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public bookingId: number;
    public status: number;
    public lessonTitle: string;
    public feedback: string;
    public progressPercentage: number;
    public addedBy: string;
    public addedDate: Date;
    public remarks: string;
    public isActive: boolean;
}
