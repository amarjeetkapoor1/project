import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WRONGCURRENCY } from './app.constants';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private updateSubject = new ReplaySubject<any>(1);
  public get = this.updateSubject.asObservable();
  listing: any;
  private currencies: any[];
  private convertTo = 'INR';
  private detailNotes = '';

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
        if (req.data instanceof Array) {
          this.currencies = req.data.map(data => {
            return {
              name: data.name,
              rank: data.rank,
              market_cap: data.quotes[this.convertTo].market_cap,
              price: data.quotes[this.convertTo].price,
              circulating_supply: data.circulating_supply,
              id: data.id
            };
          });
        }
        if (req.metadata.error !== null) {
          this.updateSubject.next({error: req.metadata.error});
        }
        this.updateSubject.next(this.currencies);
      },
      err => {
        this.updateSubject.next({error: err});
      }
    );
  }

  getDetails(name: string) {

    let result;
    if (this.listing[name] === undefined) {
      result = throwError(new Error(WRONGCURRENCY));
    } else {
      result = this.http.get(environment.url + this.listing[name]['id'] + '/', {
        params: {
          convert: this.convertTo,
        }
      });
    }
    return result;
  }

  getConvertTo() {
    return this.convertTo;
  }

  setConvertTo(convertTo) {
    this.convertTo = convertTo;
  }

  setDetailNotes(detailNotes) {
    this.detailNotes = detailNotes;
  }

  getDetailNotes() {
    return this.detailNotes;
  }

  load(): Promise<any> {

    this.listing = {};
    return this.http.get(environment.urlInit).pipe(
      map((res) => {
        const data: any[] = res['data'];
        data.forEach(entry => {
          this.listing[entry['name']] = {id: entry['id']};
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
