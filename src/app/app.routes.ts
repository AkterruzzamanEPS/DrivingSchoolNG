import { Routes } from '@angular/router';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { LoginComponent } from './Shared/login/login.component';
import { CategoryComponent } from './Component/category/category.component';
import { RegistrationComponent } from './Component/registration/registration.component';
import { LoginGuard } from './Shared/Service/login.guard';
import { HomeComponent } from './Component/home/home.component';
import { AdminComponent } from './Component/admin/admin.component';
import { InstructorComponent } from './Component/instructor/instructor.component';
import { AppointmentComponent } from './Component/appointment/appointment.component';
import { PackageComponent } from './Component/package/package.component';
import { PaymentComponent } from './Component/payment/payment.component';
import { SlotComponent } from './Component/slot/slot.component';
import { SlotAssignmentComponent } from './Component/slot-assignment/slot-assignment.component';
import { UserPackageComponent } from './Component/user-package/user-package.component';
import { UserComponent } from './Component/user/user.component';
import { DrivingComponent } from './DrivingWebsite/driving/driving.component';
import { ContentComponent } from './Component/content/content.component';
import { StudentComponent } from './Component/student/student.component';
import { VehicleComponent } from './Component/vehicle/vehicle.component';
import { BookingComponent } from './Component/booking/booking.component';
import { BookingRescheduleComponent } from './Component/booking-reschedule/booking-reschedule.component';
import { AttendanceComponent } from './Component/attendance/attendance.component';
import { FinalTestResultComponent } from './Component/final-test-result/final-test-result.component';
import { LessonProgresComponent } from './Component/lesson-progres/lesson-progres.component';
import { VehicleAvailabilityComponent } from './Component/vehicle-availability/vehicle-availability.component';
import { BookingProcessComponent } from './Component/booking-process/booking-process.component';
import { AdminRegistrationComponent } from './Component/admin-registration/admin-registration.component';
import { BookingCreateComponent } from './Component/booking-create/booking-create.component';
import { ProgressDetailComponent } from './Component/progress-detail/progress-detail.component';
import { ExpenditureComponent } from './Component/expenditure/expenditure.component';
import { ExpenditureCreateComponent } from './Component/expenditure-create/expenditure-create.component';
import { ExpenditureHeadComponent } from './Component/expenditure-head/expenditure-head.component';
import { ExpenditureHeadCreateComponent } from './Component/expenditure-head-create/expenditure-head-create.component';
import { PackageCreateComponent } from './Component/package-create/package-create.component';
import { SlotCreateComponent } from './Component/slot-create/slot-create.component';
import { DueListComponent } from './Component/due-list/due-list.component';
import { PaymentCollectionReportsComponent } from './Component/payment-collection-reports/payment-collection-reports.component';
import { LessonCreateComponent } from './Component/lesson-create/lesson-create.component';
import { PaymentCreateComponent } from './Component/payment-create/payment-create.component';

export const routes: Routes = [
    {
        path: "", component: HomeComponent, title: "Driving",
        children: [
            { path: '', component: DrivingComponent, title: 'Driving Home' },
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: 'login', component: LoginComponent, canActivate: [LoginGuard], title: 'Log in User' },
            { path: 'registration', component: RegistrationComponent, canActivate: [LoginGuard], title: 'Registration' },
            { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
            { path: 'category', component: CategoryComponent, title: 'Category List' },
            { path: 'appointment', component: AppointmentComponent, title: 'Appointment List' },
            { path: 'instructor', component: InstructorComponent, title: 'Instructor List' },
            { path: 'student', component: StudentComponent, title: 'Student List' },
            { path: 'student-registration', component: AdminRegistrationComponent, title: 'Registration' },
            { path: 'payment', component: PaymentComponent, title: 'Payment List' },
            { path: 'payment/:id', component: PaymentCreateComponent, title: 'Payment Create' },
            { path: 'package', component: PackageComponent, title: 'Package List' },
            { path: 'due-list', component: DueListComponent, title: 'Due List' },
            { path: 'payment-collection-list', component: PaymentCollectionReportsComponent, title: 'Payment Collection Report' },
            { path: 'package/:id', component: PackageCreateComponent, title: 'Package Create' },
            { path: 'slot', component: SlotComponent, title: 'Slot List' },
            { path: 'slot/:id', component: SlotCreateComponent, title: 'Slot Create' },
            { path: 'content', component: ContentComponent, title: 'Content List' },
            { path: 'instructor-availability', component: SlotAssignmentComponent, title: 'Instructor Availability List' },
            { path: 'vehicle-availability', component: VehicleAvailabilityComponent, title: 'Vehicle Availability List' },
            { path: 'user-package', component: UserPackageComponent, title: 'User Package List' },
            { path: 'user', component: UserComponent, title: 'User List' },
            { path: 'vehicle', component: VehicleComponent, title: 'Vehicle List' },
            { path: 'lesson', component: BookingComponent, title: 'Lesson List' },
            { path: 'lesson/:id', component: BookingCreateComponent, title: 'Lesson Create' },
            { path: 'lesson-atecre/:id', component: LessonCreateComponent, title: 'Lesson Create' },
            { path: 'booking-process', component: BookingProcessComponent, title: 'Booking Process List' },
            { path: 'booking-reschedule', component: BookingRescheduleComponent, title: 'Booking Reschedule List' },
            { path: 'attendance', component: AttendanceComponent, title: 'Attendance List' },
            { path: 'final-test-result', component: FinalTestResultComponent, title: 'FinalTest Result List' },
            { path: 'lesson-progres/:id', component: LessonProgresComponent, title: 'LessonProgres Create' },
            { path: 'progres-detail/:id', component: ProgressDetailComponent, title: 'LessonProgres Detail' },
            { path: 'expenditure', component: ExpenditureComponent, title: 'Expenditure' },
            { path: 'expenditure/:id', component: ExpenditureCreateComponent, title: 'Expenditure Create' },
            { path: 'head', component: ExpenditureHeadComponent, title: 'Expenditure Head' },
            { path: 'head/:id', component: ExpenditureHeadCreateComponent, title: ' Expenditure Head Create' },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
    },
    {
        path: '**',
        redirectTo: 'admin/login'
    }
];
