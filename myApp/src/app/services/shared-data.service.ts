import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private addressSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  updateAddress(address: string) {
    this.addressSubject.next(address);
  }

  get currentAddress() {
    return this.addressSubject.asObservable();
  }
}