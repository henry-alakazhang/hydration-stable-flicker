import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

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
  private REPRODUCE_BUG = true;

  private http = inject(HttpClient);

  protected response$ = this.request(this.REPRODUCE_BUG);

  request(bug: boolean): Observable<any> {
    if (bug) {
      // When a request is uncached (in this case, an unsuccessful request),
      // the server waits for the response and SSRs the "RESPONSE RECEIVED"
      // But the client doesn't wait for the response and hydrates a duplicated state

      // This is also replicable for other uncached requests like POST,
      return this.http
        .post<any>(`https://www.freelancer.com/api/ping`, {})
        .pipe(catchError((err) => of(err)));
    }

    // When the request is successful, it works as expected.
    // Both server and client render only RESPONSE RECEIVED. There is no double state.
    return this.http
      .get<any>(`https://www.freelancer.com/api/ping`, {})
      .pipe(catchError((err) => of(err)));
  }
}
