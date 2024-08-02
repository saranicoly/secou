import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private addressSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private routeStreets: Subject<any> = new Subject<any>();
  routeStreets$ = this.routeStreets.asObservable();

  constructor() {}

  updateAddress(address: string) {
    this.addressSubject.next(address);
  }

  get currentAddress() {
    return this.addressSubject.asObservable();
  }

  sendRouteStreets(routeStreets: any) {
    this.routeStreets.next(routeStreets);
  }
}