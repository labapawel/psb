import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Projekt systemu do scoringu kredytowego (Credit Scoring) dla klientów detalicznych - Paweł Łaba indeks:167122';
}
