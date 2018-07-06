import { Component, OnInit, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { CurrencyService } from '../currency.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {

  error: boolean;
  @ViewChild('td') td: Table;
  convertTo: string;
  cols: { field: string; header: string; }[];
  msg = 'Loading Data';
  currencies: any[];
  listOfCurrencies: SelectItem[];
  constructor(private currency: CurrencyService,
    private router: Router) {

  }

  ngOnInit() {
    this.currency.get.subscribe(
      (currencies: any[])   => {
        if ( currencies.length > 0) {
          this.currencies = currencies;
          this.td.reset();
          this.error = false;
          this.msg = 'Data loaded';
        } else {
          this.error = true;
          this.msg = 'Could not load Data. Want to retry';
        }
      },
      err => {
        this.error = true;
        this.msg = 'Could not load Data. Want to retry';
      },
      () => {
        this.error = false;
        this.msg = 'Data loaded';
      }
    );

    this.convertTo = this.currency.getConvertTo();
    this.listOfCurrencies = [
      {label: 'INR', value: 'INR'},
      {label: 'USD', value: 'USD'},
      {label: 'EUR', value: 'EUR'}
    ];
    this.cols = [
      { field: 'rank', header: '#' },
      { field: 'id', header: 'id'},
      { field: 'name', header: 'Name' },
      { field: 'market_cap', header: 'Market Cap' },
      { field: 'circulating_supply', header: 'Circulating Supply' }
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  onChange(event) {
    this.currency.convertTo = event;
    this.currency.update();
  }

  retry() {
    this.currency.update();
  }

  showDetails(name, notes) {
    this.currency.detailNotes = notes;
    this.router.navigate(['/details', name]);
  }
}
