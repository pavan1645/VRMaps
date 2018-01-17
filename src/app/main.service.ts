import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {

	constructor(private http: Http) {
	}

	init(){
		return this.http.get("http://localhost:3000/api/")
		.map(res => res.json());
	}

}
