export class Holiday {
    constructor() {
        this.dateTxt = "";
        this.date = "";
        this.day = 0;
        this.isMonth = true;
        this.description = ""
        this.AssignedSlots = 0;
        this.AvailableSlots = 0;
        this.IsSlotAvailable = true;
        this.TotalSlots = 0;
        this.Slots = [];
    }
    public dateTxt: string;// PK. DO NOT SHOW IN THE GRID
    public date?: string;
    public day: number;
    public isMonth: boolean;
    public description?: string;
    public AssignedSlots: number;
    public AvailableSlots: number;
    public IsSlotAvailable: boolean;
    public TotalSlots: number;
    public Slots: any[];
}


export class OrgOffDayDetailsDto {
    constructor() {
        this.noOfTotalDay = 0;
        this.noOfWorkingDay = 0;
        this.noOfOffDay = 0;
        this.offDayList = [];
        this.orgMonthlyOffDayCountList = [];
    }
    public noOfTotalDay: number;
    public noOfWorkingDay: number;
    public noOfOffDay: number;
    public offDayList?: [];
    public orgMonthlyOffDayCountList: OrgMonthlyOffDayCountDto[];

}

export class OffDayDto {
    constructor() {
        this.yearId = 0;
        this.monthId = 0;
        this.dayList = [];
        this.relatedModule = "";
    }
    public yearId?: number
    public monthId?: number
    public dayList: Date[];
    public relatedModule: string
}
export class OrgMonthlyOffDayCountDto {
    constructor() {
        this.MonthName = "";
        this.CountOrgOffDay = 0;
    }
    public MonthName: "";
    public CountOrgOffDay: number;
}



export class OffDayProjectDto {
    constructor() {
        this.offDayMonthId = 0;
        this.offDayYearId = 0;
        this.offDayRelatedModule = "";
        this.offDayDepartmentId = 0;
        this.offDayProjectId = 0;
    }

    public offDayMonthId: number;
    public offDayYearId: number;
    public offDayRelatedModule: string;
    public offDayDepartmentId: number;
    public offDayProjectId: number;
}

//export class OffDayFormDto : OffDayDto
export class OffDayFormDto extends OffDayProjectDto {
    constructor() {
        super();
        this.OffDayDatetimeList = [];
    }
    public OffDayDatetimeList: Date[]
}



export class OffDayDetailsDto {

    constructor() {
        this.noOfTotalDay = 0;
        this.noOfWorkingDay = 0;
        this.noOfOffDay = 0;
        this.offDayDatetimeList = [];
        this.monthlyOffDayCountList = [];
    }
    public noOfTotalDay: number;
    public noOfWorkingDay: number;
    public noOfOffDay: number;
    public offDayDatetimeList: Date[];
    public monthlyOffDayCountList: MonthlyOffDayCountDto[]
}


export class MonthlyOffDayCountDto {

    constructor() {
        this.monthName = "";
        this.countOffDay = 0;
    }
    public monthName: string;
    public countOffDay: number;
}