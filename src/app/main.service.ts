import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {
	
	constructor(private http: Http) {
	}
	
	getAllMarkers(){
		return this.http.get("/api/marker")
		.map(res => res.json());
	}
	
	getMarker(id:string){
		return this.http.get("/api/marker/"+id)
		.map(res => res.json());
	}
	
	getPano(id: string) {
		return this.http.get("/api/pano/" + id)
		.map(res => res.json());
	}
	
	addMarkerToPano(id: string, marker) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post("/api/pano/" + id + "/marker", marker, { headers: headers })
		.map(res => res.json());
	}
	
	addMarker(marker){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post("/api/marker/", marker, { headers: headers })
		.map(res => res.json());
	}
	
	getPath(src, dest) {
		return this.http.get("/api/path/" + src+"/"+dest+"/")
		.map(res => res.json());
	}
}
