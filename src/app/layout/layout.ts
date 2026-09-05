import { Component } from '@angular/core';
import { Navbar } from '../shared/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../shared/components/toast/toast';
@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    Navbar,
    ToastComponent 
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
