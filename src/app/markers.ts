import { MainService } from './main.service';

export class Marker {
	image_id : string;
	tooltip_content : string;
	viewer: any;
	constructor(private mainService: MainService) { }
	public load(viewer, id) {
		this.viewer = viewer;
		viewer.clearMarkers();
		this.mainService.getMarker(id)
		.subscribe(res => {
			console.log(res);
		});
	}
	public addMarker(viewer,id,marker){
		this.mainService.addMarker(id, marker)
		.subscribe(res => {
			console.log(res);
		});
	}
}