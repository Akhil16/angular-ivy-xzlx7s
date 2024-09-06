import { Component, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, concatMap, of } from 'rxjs';

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
    this.waterfall(
      [
        function (callback) {
          setTimeout(function () {
            console.log('FIRST');
            callback(null, 'b');
          }, 100);
        },
        function (param, callback) {
          setTimeout(function () {
            console.log('SECOND', param);
            callback(null, 'c', 'd');
          }, 50);
        },
        function (param1, param2, callback) {
          setTimeout(function () {
            console.log('THIRD', param1, param2);
            callback(null, 'e');
          }, 10);
        },
      ],
      function (err, result) {
        console.log('err', err);
        console.log('result', result);
      }
    );
  }

  waterfall(tasks: any, finalCallback: any) {
    tasks
      .map((task) => (...args: any[]) => {
        return new Observable((subscriber) => {
          task(...args, (err: Error, ...results: any[]) => {
            if (err) {
              subscriber.error(err);
            } else {
              subscriber.next(results);
              subscriber.complete();
            }
          });
        });
      })
      .reduce((acc, func) => {
        return acc.pipe(concatMap((args: []) => func(...args)));
      }, of([]))
      .subscribe({
        next: (results) => finalCallback(null, ...results),
        error: (err) => finalCallback(err),
      });
  }
}
