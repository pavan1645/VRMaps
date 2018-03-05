import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';

import { FormsModule } from "@angular/forms"; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { MainService } from './main.service';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { RoutingComponent } from './routing/routing.component';

const appRoutes: Routes = [
	{ path: 'gallery', component: GalleryComponent },
	{path: '**', component: AppComponent}
];

@NgModule({
	declarations: [
		AppComponent,
		GalleryComponent,
		RoutingComponent
	],
	imports: [
		RouterModule.forRoot(
			appRoutes,
		),
		HttpModule,
		BrowserModule,
		NgbModule.forRoot(),
		FormsModule
	],
	providers: [MainService],
	bootstrap: [RoutingComponent]
})
export class AppModule { }
