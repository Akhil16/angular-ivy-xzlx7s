import { Component, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { decode } from 'html-entities';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  i = 0;
  constructor(private router: Router) {}

  call() {
    if (this.i === 0) {
      this.i = 1;
      this.router.navigateByUrl('home');
    } else if (this.i === 1) {
      this.i = 2;
      this.router.navigateByUrl('home?key=aaa???');
    } else if (this.i === 2) {
      this.i = 0;
      this.router.navigate(['home'], {
        queryParams: { key: decode('bbb??') },
      });
    }
  }
}
