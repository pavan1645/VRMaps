import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { addMarkers } from './addMarkers';

declare var PhotoSphereViewer: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	viewer: any;
	private addMarkers: Function;

	constructor(private mainService: MainService) { }
	
	ngOnInit() {
		let viewer = this.viewer;
		this.mainService.init()
		.subscribe( res =>{
			console.log(res);
		});
		viewer = PhotoSphereViewer({
			container: document.getElementById('psv'),
			panorama: 'assets/images/pano.jpg',
			time_anim: false,
			size: {
				height: 700
			},
			navbar: [
			'autorotate',
			'zoom',
			'markers',
			'caption',
			'fullscreen'
			],
			markers: [{
				id: 'pano3',
				circle: 20,
				anchor: "0% 0%",
				latitude: -0.19572995016390782,
				longitude: 1.6102829072439,
				svgStyle: {
					fill: 'rgba(250, 0, 0, 0.3)'
				},
				tooltip: {
					content: 'view next image',
					position: 'top center'
				}
			}]
		});

		viewer.on('select-marker', function (marker) {
			viewer.setPanorama('assets/images/'+marker.id+'.jpg', true);
			addMarkers(viewer, marker.id);
		});
	}
}
