import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { appVersion } from '../constants/version';

@Injectable({
  providedIn: 'root',
})
export class AppVersionService {
  private appVersionChangedSubject = new BehaviorSubject<boolean>(false);
  public appVersionChanged$ = this.appVersionChangedSubject.asObservable();

  constructor() {
    const appVersionString = localStorage.getItem('appVersion');
    if (appVersionString) {
      const appV = JSON.parse(appVersionString) as number;

      if (appV !== appVersion) {
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
