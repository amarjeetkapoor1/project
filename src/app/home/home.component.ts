import { Component, OnInit, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { CurrencyService } from '../currency.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { PROGRESS, ERRORMSG, SUCCESSMSG } from 'src/app/app.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnChanges {

  error: boolean;
  @ViewChild('td') td: Table;
  convertTo: string;
  cols: { field: string; header: string; }[];
  msg = PROGRESS;
  currencies: any[];
  listOfCurrencies: SelectItem[];
  constructor(private currency: CurrencyService,
    private router: Router) {

  }

  ngOnInit() {
    this.currency.get.subscribe(
      (currencies: any[]) => {
        if (currencies.length > 0) {
          this.currencies = currencies;
          this.td.reset();
          this.error = false;
          this.msg = SUCCESSMSG;
        } else {
          this.error = true;
          this.msg = ERRORMSG;
        }
      },
      err => {
        this.error = true;
        this.msg = ERRORMSG;
      },
      () => {
        this.error = false;
        this.msg = SUCCESSMSG;
      }
    );

    this.convertTo = this.currency.getConvertTo();
    this.listOfCurrencies = [
      { label: 'INR', value: 'INR' },
      { label: 'USD', value: 'USD' },
      { label: 'EUR', value: 'EUR' }
    ];
    this.cols = [
      { field: 'rank', header: '#' },
      { field: 'id', header: 'id' },
      { field: 'name', header: 'Name' },
      { field: 'market_cap', header: 'Market Cap' },
      { field: 'circulating_supply', header: 'Circulating Supply' }
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  onChange(convertTo) {
    this.currency.setConvertTo(convertTo);
    this.currency.update();
  }

  retry() {
    this.currency.update();
  }

  showDetails(name, notes) {
    this.currency.setDetailNotes(notes);
    this.router.navigate(['/details', name]);
  }
}
