import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrencyService } from './currency.service';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyDetailsComponent } from './currency-details/currency-details.component';

const routes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'details/:name', component: CurrencyDetailsComponent},
  /*
  {path: 'listOfMsg', component: ListOfMsgComponent}, */
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CurrencyDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {useHash: true}),
    TableModule
  ],
  providers: [CurrencyService],
  bootstrap: [AppComponent]
})
export class AppModule { }