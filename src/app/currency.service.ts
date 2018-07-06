import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  listing: any;
  private currencies: any[];
  private updateSubject = new ReplaySubject<any[]>(1);
  get = this.updateSubject.asObservable();
  convertTo = 'INR';
  detailNotes = '';

  constructor(private http: HttpClient) {
    this.currencies = [];
    this.update();
  }

  update() {
    this.http.get(environment.url, {
      params: {
        convert: this.convertTo,
        limit: '20',
        sort: 'rank',
        structure: 'array',

      }
    }).subscribe(
      (req: any) => {
        this.currencies = req.data.map(data => {
          return {
            name: data.name,
            rank: data.rank,
            market_cap: data.quotes[this.convertTo].market_cap,
            price: data.quotes[this.convertTo].price,
            circulating_supply: data.circulating_supply,
            id: data.id,
            notes: ''
          };
        });
        this.updateSubject.next(this.currencies);
      },
      err => {
        this.updateSubject.next([]);
      }
    );
  }

  getDetails(name: string) {

    return this.http.get(environment.url + this.listing[name] + '/', {
      params: {
        convert: this.convertTo,
      }
    });
  }

  getConvertTo() {
    return this.convertTo;
  }
  load(): Promise<any> {

    this.listing = {};

    return this.http.get(environment.urlInit).pipe(
      map((res) => {
        const data: any[] = res['data'];
        data.forEach(entry => {
          this.listing[entry['name']] = entry['id'];
        });
      })
    ).toPromise().catch((err: any) => Promise.resolve());
  }
}


export interface Currency {

  name: string;
  rank: string;
  market_cap: string;
  price: string;
  circulating_supply: string;
  id: string;
  notes: string;
}
