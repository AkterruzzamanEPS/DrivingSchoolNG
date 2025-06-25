import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DatePipe]
})
export class HomeComponent {

}
