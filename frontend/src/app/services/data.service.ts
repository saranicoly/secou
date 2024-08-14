import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data: any;
    private flag: boolean;
    private center: any

    setData(data: any) {
        this.data = data;
    }

    setFlag(flag: boolean) {
        this.flag = flag;
    }

    setCenter(center: any) {
        this.center = center;
    }

    getCenter() {
        return this.center;
    }

    getData() {
        return this.data;
    }

    getFlag() {
        return this.flag;
    }
}
