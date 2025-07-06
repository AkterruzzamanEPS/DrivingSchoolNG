import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenditureRequestDto } from '../../Model/Expenditure';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-expenditure-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenditure-create.component.html',
  styleUrl: './expenditure-create.component.scss',
  providers: [DatePipe]
})
export class ExpenditureCreateComponent implements OnInit {

  public ExpenditureList: any[] = [];
  public oExpenditureRequestDto = new ExpenditureRequestDto();
  public ExpenditureId = 0;

  trackByExpenditure: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {

  }


  ngOnInit(): void {
    this.GetAllExpenditureHeades();
    
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.ExpenditureId = Number(id);
      if (this.ExpenditureId > 0) {
        this.GetExpenditureById();
      } else {
        this.oExpenditureRequestDto = new ExpenditureRequestDto();
        this.ExpenditureId = 0;
      }
    }
  }

  Reset() {
    this.oExpenditureRequestDto = new ExpenditureRequestDto();
  }
  BackToList() {
    this.router.navigateByUrl('admin/expenditure')
  }


  public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          this.oExpenditureRequestDto.fileId = res.id;
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }

  GetImageUrl(fileId: number): string {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }

  private GetExpenditureById() {
    this.http.Get(`Expenditure/GetExpenditureById/${this.ExpenditureId}`).subscribe(
      (res: any) => {
        this.oExpenditureRequestDto.name = res.name;
        this.oExpenditureRequestDto.expenditureHeadId = Number(res.expenditureHeadId);
        this.oExpenditureRequestDto.fileId = Number(res.fileId);
        this.oExpenditureRequestDto.amount = Number(res.amount);
        this.oExpenditureRequestDto.isActive = CommonHelper.booleanConvert(res.isActive);
        this.oExpenditureRequestDto.remarks = res.remarks;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }
  private GetAllExpenditureHeades() {
    this.http.Get(`ExpenditureHead/GetAllExpenditureHeades`).subscribe(
      (res: any) => {
        this.ExpenditureList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }



  public InsertExpenditure() {
    if (this.oExpenditureRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oExpenditureRequestDto.amount == 0) {
      this.toast.warning("Amount is geather then 0 ", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oExpenditureRequestDto.expenditureHeadId == 0) {
      this.toast.warning("Please select head", "Warning!!", { progressBar: true });
      return;
    }
    this.oExpenditureRequestDto.expenditureHeadId = Number(this.oExpenditureRequestDto.expenditureHeadId);
    this.oExpenditureRequestDto.amount = Number(this.oExpenditureRequestDto.amount);
    this.oExpenditureRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureRequestDto.isActive);
    
    // After the hash is generated, proceed with the API call
    this.http.Post(`Expenditure/InsertExpenditure`, this.oExpenditureRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateExpenditure() {

    if (this.oExpenditureRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oExpenditureRequestDto.amount == 0) {
      this.toast.warning("Amount is geather then 0 ", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oExpenditureRequestDto.expenditureHeadId == 0) {
      this.toast.warning("Please select head", "Warning!!", { progressBar: true });
      return;
    }

    this.oExpenditureRequestDto.expenditureHeadId = Number(this.oExpenditureRequestDto.expenditureHeadId);
    this.oExpenditureRequestDto.amount = Number(this.oExpenditureRequestDto.amount);
    this.oExpenditureRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Expenditure/UpdateExpenditure/${this.ExpenditureId}`, this.oExpenditureRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


}
