import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe],
  template: `
    @if ((response$ | async) == undefined) {
    <div>LOADING... WAITING FOR REQUEST...</div>
    } @else {
    <div>RESPONSE RECEIVED</div>
    }
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private http = inject(HttpClient);

  protected response$ = this.http.get<any>(
    `https://www.freelancer.com/api/ping`
  );
}
