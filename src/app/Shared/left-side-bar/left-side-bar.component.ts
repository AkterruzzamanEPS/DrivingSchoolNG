import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.scss'
})
export class LeftSideBarComponent {

}
