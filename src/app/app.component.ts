import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { Marker } from './markers';
import { Pano } from './pano';
//import * from 'jquery';

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
	constructor(private mainService: MainService) { }
	
	ngOnInit() {
		let viewer = this.viewer;
		let pano = new Pano(this.mainService);
		viewer = PhotoSphereViewer({
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
		//console.log(viewer.isGyroscopeEnabled());
		viewer.once('panorama-loaded', () => {
			pano.load(viewer,this.id);
		});
		viewer.on('dblclick', (e) => {
			console.log(this.id + " on");
			$(".formPost").css("display","block");
			$("#lat").val(e.latitude);
			$("#long").val(e.longitude);
		});
		viewer.on('select-marker', (marker) => {
			this.id=marker.id;
			pano.load(viewer, marker.id);
			console.log(this.id + " selected");
		});
	}
	addMarker(){
		let newMarker = {
			image_id:$("#image_id").val(),
			tooltip_content:$("#tooltip").val(),
			latitude:$("#lat").val(),
			longitude:$("#long").val()
		};
		let marker:Marker=new Marker(this.mainService);
		marker.addMarker(this.viewer,this.id,newMarker);
	}
}