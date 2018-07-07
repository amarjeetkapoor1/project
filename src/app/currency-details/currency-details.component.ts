import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/currency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ERRORMSG, SUCCESSMSG, PROGRESS } from 'src/app/app.constants';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html'
})
export class CurrencyDetailsComponent implements OnInit {

  error: boolean;
  msg: string;
  currencyDetail: any;
  notes: string;

  constructor(private currency: CurrencyService,
    private route: ActivatedRoute,
    private router: Router) {
      this.msg = PROGRESS;
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        if (params['name'] !== undefined) {
          this.currency.getDetails(params['name']).subscribe(
            currencyDetail => {
              this.currencyDetail = currencyDetail['data'];
              this.notes = this.currency.listing[params['name']]['notes'];
              this.error = false;
              this.msg = SUCCESSMSG;
            },
            err => {
              this.error = true;
              this.msg = err;
            }

          );
        } else {
          this.back();
        }
      },
        err => {
          this.error = true;
          this.msg = ERRORMSG;
        }
      );
  }

  back() {
    this.router.navigate(['']);
  }

}
