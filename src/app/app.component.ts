import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { Pano } from './pano';
//import * from 'jquery';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

declare var PhotoSphereViewer: any;
declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	private addMarkers: Function;
	private  viewer: any;
	public id : string = "pano1";
	public pano: any;
	public path: any = [];
	public allMarkers: any = [];
	public model: any;
	public srcModel: any = { image_id: "pano1", tooltip_content: "615 front door" };
	public destModel: any;
	public panoClass: string = "text-secondary";
	public pathClass: string = "text-secondary";
	constructor(private mainService: MainService) { }
	
	ngOnInit() {
		let viewer = PhotoSphereViewer({
			container: document.getElementById('psv'),
			panorama: './assets/images/pano1.jpg',
			time_anim: false,
			size: {
				height: 700
			},
			navbar: [
				'gyroscope',
				'autorotate',
				'zoom',
				'markers',
				'caption',
				'fullscreen'		
			],
			gyroscope: true
		});
		
		this.viewer = viewer;
		let pano = new Pano(this.mainService, this.viewer);
		this.pano = pano;
		
		viewer.once('panorama-loaded', () => {
			pano.load(this.id);
		});
		
		viewer.on('dblclick', (e) => {
			$("#m2p #lat").val(e.latitude);
			$("#m2p #long").val(e.longitude);
		});
		
		viewer.on('select-marker', (marker) => {
			this.id=marker.id;
			if (this.path.length > 0 && this.id == this.path[this.path.length - 1]) this.setText("path", "Destination Reached", 1); 
			else this.setText("path", "", 0); 
			this.setSourceModel(this.id);
			pano.load(marker.id)
			.then(() => {
				this.colorMarkers();
			});
		});
		
		this.mainService.getAllMarkers()
		.subscribe((res) => {
			this.allMarkers = res; 
		});
	}
	
	viewPano(){
		/* Error Handling Stuff */
		if (!this.model) { this.setText("pano","Enter location first", -1); return; }
		if (!this.model.image_id) { this.setText("pano","Wrong input, please select from suggestions list", -1); return; }
		this.pano.load(this.model.image_id)
		.then(() => {
			this.id = this.model.image_id;
			this.setSourceModel(this.id);
			this.colorMarkers();
			this.setText("pano","Location Loaded!", 1);
		});
	}
	
	addMarkerToPano(){
		let newMarker = {
			image_id: $("#m2p #image_id").val(),
			latitude: $("#m2p #lat").val(),
			longitude: $("#m2p #long").val()
		};
		this.mainService.addMarkerToPano(this.id, newMarker)
		.subscribe((res) => {
			console.log(res);
			this.pano.load(this.id);
		});
	}
	
	addMarker(){
		let marker = {
			image_id: $('#m2db #image_id').val(),
			tooltip_content: $('#m2db #tooltip').val(),
		}
		this.mainService.addMarker(marker)
		.subscribe((res) => {
			console.log(res);
			if (res.error) $('#m2db .text-muted').text(res.error);
			else $('#m2db .text-muted').text("Added to DB");
			
			setTimeout(function() {
				$('#m2db .text-muted').text("");
			}, 2000);
		});
	}
	
	getPath(){
		/* Error Handling Stuff */
		if (!this.srcModel || !this.destModel) { this.setText("path", "Enter source and destination", -1); return; }
		if (!this.srcModel.image_id || !this.destModel.image_id) { this.setText("path", "Wrong input, please select from suggestions list", -1); return; }

		let src = this.srcModel.image_id;
		let dest = this.destModel.image_id;
		/* Error Handling Stuff */
		if (src == dest) { this.setText("path", "Same source and destination found", -1); return; }
		this.mainService.getPath(src, dest)
		.subscribe(res => {
			if (res.error) { this.setText("path", res.error, -1); return; }
			else this.setText("path", res, 1);
			this.path = res;
			//reset previous colors and add load again
			this.pano.load(this.id)
			.then(() => {
				this.colorMarkers();
			});
		})
	}
	
	clearPath(){
		this.path = [];
		this.pano.load(this.id);
		this.setText("path", "", 0);
	}
	
	colorMarkers(){
		let currMarkers = this.pano.pano.markers;
		let currMarker;
		currMarkers.forEach(marker => {
			if (this.path.indexOf(marker.info.image_id) > -1 && this.path.length > 0) {
				if(this.id != marker.info.image_id) {
					currMarker  = this.viewer.getMarker(marker.info.image_id);
					currMarker.update({"svgStyle":{"fill":"rgba(0,250,0,0.3)"}})
				}
			}
		});
		//rotating camera to path next
		let index = this.path.indexOf(this.id);
		for (var i = index; i < this.path.length; i++) {
			currMarker = this.path[i];
			if (currMarkers.findIndex(x => x.info.image_id == currMarker) > -1) {
				this.viewer.gotoMarker(currMarker, 1000);
				break;
			}
		}
	}

	setText(type: string, msg: string, status:any){
		if (type == "path") {
			$('#path #text-utility').text(msg);
			switch (status) {
				case -1: this.pathClass = "text-danger"; break;
				case 1: this.pathClass = "text-success"; break;
				default: this.pathClass= "text-secondary"; break;
			}
		} else {
			$('#pano #text-utility').text(msg);
			switch (status) {
				case -1: this.panoClass = "text-danger"; break;
				case 1: this.panoClass = "text-success"; break;
				default: this.panoClass = "text-secondary"; break;
			}
		}
	}
	
	setSourceModel = (id: string) => this.srcModel = this.allMarkers.find(o => o.image_id === id);

	search = (text$: Observable<string>) => {
		return text$
		.debounceTime(200)
		.map(term => term === '' ? []
		: this.allMarkers.filter(v => v.tooltip_content.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
	}
	
	formatter = (x: { tooltip_content: string }) => x.tooltip_content;
}