import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ExpenditureHeadRequestDto } from '../../Model/ExpenditureHead';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-Expenditure-head-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenditure-head-create.component.html',
  styleUrl: './expenditure-head-create.component.scss',
  providers: [DatePipe]
})
export class ExpenditureHeadCreateComponent implements OnInit {

  public ExpenditureHeadList: any[] = [];
  public oExpenditureHeadRequestDto = new ExpenditureHeadRequestDto();
  public ExpenditureHeadId = 0;

  trackByExpenditureHead: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {

  }


  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.ExpenditureHeadId = Number(id);
      if (this.ExpenditureHeadId > 0) {
        this.GetExpenditureHeadById();
      } else {
        this.oExpenditureHeadRequestDto = new ExpenditureHeadRequestDto();
        this.ExpenditureHeadId = 0;
      }
    }
  }

  Reset() {
    this.oExpenditureHeadRequestDto = new ExpenditureHeadRequestDto();
  }
  BackToList() {
    this.router.navigateByUrl('admin/head')
  }

  private GetExpenditureHeadById() {
    this.http.Get(`ExpenditureHead/GetExpenditureHeadById/${this.ExpenditureHeadId}`).subscribe(
      (res: any) => {
        this.oExpenditureHeadRequestDto.name = res.name;
        this.oExpenditureHeadRequestDto.isActive = CommonHelper.booleanConvert(res.isActive);
        this.oExpenditureHeadRequestDto.remarks = res.remarks;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }



  public InsertExpenditureHead() {
    if (this.oExpenditureHeadRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }

    this.oExpenditureHeadRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureHeadRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ExpenditureHead/InsertExpenditureHead`, this.oExpenditureHeadRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateExpenditureHead() {

    if (this.oExpenditureHeadRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }

    this.oExpenditureHeadRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureHeadRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ExpenditureHead/UpdateExpenditureHead/${this.ExpenditureHeadId}`, this.oExpenditureHeadRequestDto).subscribe(
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
