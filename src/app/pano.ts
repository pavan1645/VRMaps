import { MainService } from './main.service';
import { Marker } from "./markers";
export class Pano {
	id: string;
	markers: [{
		image_id: string;
		latitude: string;
		longitude: string;
	}];
	
	/**
	* load
	*/
	constructor(private mainService: MainService, private viewer: any) { }
	public load(id) {
		let viewer = this.viewer;
		viewer.clearMarkers();
		this.mainService.getPano(id)
		.subscribe(res => {
			viewer.setPanorama("./assets/images/" + id + ".jpg");
			if (res[0].hasOwnProperty('markers')) {
				let markers = res[0].markers;
				markers.forEach(marker => {
					viewer.addMarker({
						id: marker.info.image_id,
						circle: 20,
						anchor: "0% 0%",
						latitude: marker.latitude,
						longitude: marker.longitude,
						svgStyle: {
							fill: 'rgba(250, 0, 0, 0.3)'
						},
						tooltip: {
							content: marker.info.tooltip_content,
							position: 'top center'
						}
					})
				});
			}
			return res;
		});
	}	
}