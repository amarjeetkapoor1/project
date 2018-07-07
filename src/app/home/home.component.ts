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
  cols: { field: string; header: string; width: string }[];
  msg: string;
  currencies: any[];
  listOfCurrencies: SelectItem[];

  constructor(private currency: CurrencyService,
    private router: Router) {
      this.msg = PROGRESS;
  }

  ngOnInit() {
    this.currency.get.subscribe(
      (currencies: any) => {
        if (currencies.error === undefined) {
          this.currencies = currencies;
          this.error = false;
          this.msg = SUCCESSMSG;
        } else {
          this.msg = ERRORMSG;
          this.error = this.currencies ? false : true;
        }
      }
    );

    this.convertTo = this.currency.getConvertTo();
    this.listOfCurrencies = [
      { label: 'INR', value: 'INR' },
      { label: 'USD', value: 'USD' },
      { label: 'EUR', value: 'EUR' }
    ];
    this.cols = [
      { field: 'rank', header: '#', width: '5%' },
      { field: 'id', header: 'id', width : '7%' },
      { field: 'name', header: 'Name', width : '10%'},
      { field: 'circulating_supply', header: 'Circulating Supply', width : '15%'}
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
    this.error = false;
    this.msg = PROGRESS;
    this.currency.update();
  }

  showDetails(name, notes) {
    this.currency.setDetailNotes(notes);
    this.router.navigate(['/details', name]);
  }
}
