import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {
	private url = ""
	constructor(private http: Http) {
	}
	
	getAllMarkers(){
		return this.http.get(this.url+"api/marker")
		.map(res => res.json());
	}
	
	getMarker(id:string){
		return this.http.get(this.url+"api/marker/"+id)
		.map(res => res.json());
	}
	
	getPano(id: string) {
		return this.http.get(this.url+"api/pano/" + id)
		.map(res => res.json());
	}
	
	addMarkerToPano(id: string, marker) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url+"api/pano/" + id + "/marker", marker, { headers: headers })
		.map(res => res.json());
	}
	
	addMarker(marker){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url+"api/marker/", marker, { headers: headers })
		.map(res => res.json());
	}
	
	getPath(src, dest) {
		return this.http.get(this.url+"api/path/" + src+"/"+dest+"/")
		.map(res => res.json());
	}
}
