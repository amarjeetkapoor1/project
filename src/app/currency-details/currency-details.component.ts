import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/currency.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html'
})
export class CurrencyDetailsComponent implements OnInit {

  error: boolean;
  msg: string;
  currencyDetail: any;
  constructor(private currency: CurrencyService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log(params);
        if (params['name'] !== undefined) {
          this.currency.getDetails(params['name']).subscribe(
            currencyDetail => {
              this.currencyDetail = currencyDetail['data'];
              this.error = false;
              this.msg = 'Data loaded';
            },
            err => {
              this.error = true;
              this.msg = 'Could not load Data. Want to retry';
            }

          );
        } else {
          this.back();
        }
      },
        err => {
          this.error = true;
          this.msg = 'Could not load Data. Want to retry';
        }
      );
  }

  back() {
    this.router.navigate(['']);
  }

}
