export class FinalTestResultFilterRequestDto {

    constructor() {
        this.name = '';
        this.startDate = new Date();
        this.endDate =new Date();
        this.isActive = true;
    }
    public name: string;
    public startDate: Date;
    public endDate: Date;
    public isActive: boolean;
}

export class FinalTestResultRequestDto {

    constructor() {
        this.studentId = 0;
        this.instruction = '';
        this.testDate = new Date();
        this.testType = 0;
        this.score = 0;
        this.passed = true;
        this.evaluatedBy = '';
        this.evaluatedDate = new Date();
        this.isActive = true;
        this.remarks = "";
    }
    public studentId: number;
    public instruction: string;
    public testDate: Date;
    public testType: number;
    public score: number;
    public passed: boolean;
    public evaluatedBy: string;
    public evaluatedDate: Date;

    public remarks: string;
    public isActive: boolean;
}