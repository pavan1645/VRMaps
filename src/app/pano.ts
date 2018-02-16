import { MainService } from './main.service';
export class Pano {
	pano: any;
	constructor(private mainService: MainService, private viewer: any) { }
	public load(id) {
		return new Promise((resolve) => {
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
								fill: 'rgba(250, 250, 250, 0.8)'
							},
							tooltip: {
								content: marker.info.tooltip_content,
								position: 'top center'
							}
						})
					});
				}
				this.viewer = viewer;
				//console.log(this.viewer.showMarkersList);
				this.pano = res[0];
				resolve();
			});
		});
	}	
}