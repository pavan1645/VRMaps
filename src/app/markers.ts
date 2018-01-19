import { MainService } from './main.service';

export class Marker {
	image_id : string;
	tooltip_content : string;
	constructor(private mainService: MainService) { }
	public load(viewer, id) {
		viewer.clearMarkers();
		this.mainService.getMarker(id)
		.subscribe(res => {
			console.log(res);
		});
	}
	public addMarker(id,marker){
		this.mainService.addMarker(id,marker)
	}
}