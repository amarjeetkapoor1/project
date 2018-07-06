import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private currencies: any[];
  private updateSubject = new ReplaySubject<any[]>(1);
  get = this.updateSubject.asObservable();
  convertTo = 'INR';

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
          this.currencies = req.data.map( data => {
            return {
              name: data.name,
              rank: data.rank,
              market_cap: data.quotes[this.convertTo].market_cap,
              price: data.quotes[this.convertTo].price,
              circulating_supply: data.circulating_supply,
              id: data.id
            };
          });
          this.updateSubject.next(this.currencies);
        },
        err => {
          this.updateSubject.next([]);
        }
      );
  }

  getDetails(id: string) {
    return this.http.get(environment.url + id + '/', {
      params: {
        convert: this.convertTo,
      }
    });
  }

}


export interface Currency {

  name: string;
  rank: string;
  market_cap: string;
  price: string;
  circulating_supply: string;
  id: string;
}
