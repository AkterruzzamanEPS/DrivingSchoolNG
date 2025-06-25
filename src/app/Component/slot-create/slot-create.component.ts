import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlotRequestDto } from '../../Model/Slot';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slot-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slot-create.component.html',
  styleUrl: './slot-create.component.scss',
  providers: [DatePipe]
})
export class SlotCreateComponent implements OnInit {

  public oSlotRequestDto = new SlotRequestDto();
  public SlotId = 0;
  public startTime = "";
  public endTime = "";

  trackBySlot: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {

  }


  ngOnInit(): void {

    const today = new Date();
    // Set 08:00:00 AM
    const startTimeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0);
    // Set 08:00:00 PM (20:00:00)
    const endTimeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0);

    this.startTime = this.datePipe.transform(startTimeDate, 'HH:mm:ss') || '08:00:00';
    this.endTime = this.datePipe.transform(endTimeDate, 'HH:mm:ss') || '10:00:00';

    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.SlotId = Number(id);
      if (this.SlotId > 0) {
        this.GetSlotById();
      } else {
        this.oSlotRequestDto = new SlotRequestDto();
        this.SlotId = 0;
      }
    }
  }

  Reset() {
    this.oSlotRequestDto = new SlotRequestDto();
  }
  BackToList() {
    this.router.navigateByUrl('admin/slot')
  }

  private GetSlotById() {
    this.http.Get(`Slot/GetSlotById/${this.SlotId}`).subscribe(
      (res: any) => {
        this.oSlotRequestDto.name = res.name;
        this.startTime = res.startTime;
        this.endTime = res.endTime;
        this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(res.isActive);
        this.oSlotRequestDto.remarks = res.remarks;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }



  public InsertSlot() {
    if (this.oSlotRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oSlotRequestDto.startTime = this.startTime;
    this.oSlotRequestDto.endTime = this.endTime;
    this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/InsertSlot`, this.oSlotRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.BackToList();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateSlot() {

    if (this.oSlotRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oSlotRequestDto.startTime = this.startTime;
    this.oSlotRequestDto.endTime = this.endTime;
    this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/UpdateSlot/${this.SlotId}`, this.oSlotRequestDto).subscribe(
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
