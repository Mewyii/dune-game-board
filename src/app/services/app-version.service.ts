import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { appVersion } from '../constants/version';

@Injectable({
  providedIn: 'root',
})
export class AppVersionService {
  private appVersionChangedSubject = new BehaviorSubject<boolean>(false);
  public appVersionChanged$ = this.appVersionChangedSubject.asObservable();
  public currentAppVersion = 0;
  public newAppVersion = 0;

  constructor() {
    this.newAppVersion = appVersion;

    const appVersionString = localStorage.getItem('appVersion');
    if (appVersionString) {
      this.currentAppVersion = JSON.parse(appVersionString) as number;

      if (this.currentAppVersion !== this.newAppVersion) {
        this.appVersionChangedSubject.next(true);
      }
    } else {
      localStorage.setItem('appVersion', JSON.stringify(appVersion));
    }
  }

  loadNewVersion() {
    localStorage.clear();
    location.reload();
  }
}
