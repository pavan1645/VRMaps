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
	public path: any = [];
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
			pano.load(marker.id)
			.then(() => {
				this.colorMarkers();
			});
		});
	}
	
	viewPano(){
		this.pano.load($("#pano #loc").val())
		.then(console.log("Loaded pano"));
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
		let src = $('#src').val();
		let dest = $('#dest').val();
		this.mainService.getPath(src, dest)
		.subscribe(res => {
			if (res.error) $('#path .text-muted').text(res.error);
			else $('#path .text-muted').text(res);
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
		$('#path .text-muted').text("");
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
}