import { Component } from '@angular/core';
import { Header } from './components/structure/header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
