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
	public pano: any;
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
			console.log(this.id + " on");
			$("#m2p #lat").val(e.latitude);
			$("#m2p #long").val(e.longitude);
		});

		viewer.on('select-marker', (marker) => {
			this.id=marker.id;
			pano.load(marker.id);
			console.log(this.id + " selected");
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
}