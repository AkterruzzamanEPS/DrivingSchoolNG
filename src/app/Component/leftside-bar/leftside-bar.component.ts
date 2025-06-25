import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leftside-bar',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './leftside-bar.component.html',
  styleUrl: './leftside-bar.component.scss'
})
export class LeftsideBarComponent {

}
