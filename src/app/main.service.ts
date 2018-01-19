import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {
	
	constructor(private http: Http) {
	}
	
	getMarker(id:string){
		return this.http.get("http://localhost:3000/api/marker/"+id)
		.map(res => res.json());
	}
	
	getPano(id: string) {
		return this.http.get("http://localhost:3000/api/pano/" + id)
		.map(res => res.json());
	}
	
}
