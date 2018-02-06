import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';

import { FormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";

import { AppComponent } from './app.component';

import { MainService } from './main.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
	BrowserModule,
	Ng2CompleterModule,
	FormsModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
