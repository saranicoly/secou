import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data: any;
    private flag: boolean;

    setData(data: any) {
        this.data = data;
    }

    setFlag(flag: boolean) {
        this.flag = flag;
    }

    getData() {
        return this.data;
    }

    getFlag() {
        return this.flag;
    }
}
