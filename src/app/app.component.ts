import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { Marker } from './markers';
import { Pano } from './pano';

declare var PhotoSphereViewer: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	private addMarkers: Function;
	private  viewer: any;
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
			pano.load(viewer,"pano1");
		});
		viewer.on('dblclick', (e) => {
			console.log("Lat: " + e.latitude);
			console.log("Long: "+e.longitude);
		});
		viewer.on('select-marker', function (marker) {
			pano.load(viewer, marker.id);
		});
	}
}