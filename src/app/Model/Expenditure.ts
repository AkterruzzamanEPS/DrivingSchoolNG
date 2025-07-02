

export class ExpenditureFilterRequestDto {

    constructor() {
        this.name = '';
        this.expenditureHeadId = 0;
        this.startDate = new Date();
        this.endDate = new Date();
        this.isActive = true;
    }
    public name: string;
    public expenditureHeadId: number;
    public startDate: Date;
    public endDate: Date;
    public isActive: boolean;
}



export class ExpenditureRequestDto {

    constructor() {
        this.name = '';
        this.expenditureHeadId = 0;
        this.fileId = 0;
        this.amount = 0;
        this.isActive = true;
        this.remarks = "";
    }
    public name: string;
    public expenditureHeadId: number;
    public fileId: number;
    public amount: number;
    public isActive: boolean;
    public remarks: string;
}
