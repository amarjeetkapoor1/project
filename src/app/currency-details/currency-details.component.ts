import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/currency.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit {

  currencyDetail: any;
  constructor(private currency: CurrencyService,
    private route: ActivatedRoute,
    private router: Router ) {

  }
  ngOnInit() {
    this.route.params
      .subscribe(params => {
      // Defaults to 0 if no query param provided.
      console.log(params);
      if (params['name'] !== undefined) {
        this.currency.getDetails(params['name']).subscribe(
          currencyDetail => {
            this.currencyDetail = currencyDetail['data'] ;
          }
        );
      } else {
        this.back();
      }
    });
  }

  back() {
    this.router.navigate(['']);
  }

}
