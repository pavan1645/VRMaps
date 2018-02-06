import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';

import { FormsModule } from "@angular/forms"; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { MainService } from './main.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
	BrowserModule,
	NgbModule.forRoot(),
	FormsModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
