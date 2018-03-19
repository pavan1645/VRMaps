import { MainService } from './main.service';
export class Pano {
	pano: any;
	constructor(private mainService: MainService, private viewer: any) { }
	public load(id, toFade = false) {
		return new Promise((resolve) => {
			let viewer = this.viewer;
			this.mainService.getPano(id)
			.subscribe(res => {
				viewer.clearMarkers();
				viewer.setPanorama("./assets/images/" + id + ".jpg", toFade)
				.then((pano) => {
					if (res[0].hasOwnProperty('markers')) {
						let markers = res[0].markers;
						markers.forEach(marker => {
							var markerUrl = "./assets/images/" + marker.info.image_id + ".jpg";
							/* Caching nearby panos */
							/* if (!viewer.getPanoramaCache(markerUrl)){
								viewer.preloadPanorama(markerUrl);
							} */
							var tt = null;
							if (marker.info.tooltip_content) tt = {
								content: marker.info.tooltip_content,
								position: 'top center'
							}
							
							viewer.addMarker({
								id: marker.info.image_id,
								circle: 20,
								anchor: "0% 0%",
								latitude: Number(marker.latitude),
								longitude: Number( marker.longitude),
								svgStyle: {
									fill: 'rgba(128, 0, 0, 0.3)'
								},
								tooltip: tt
							})
						});
					}
					this.viewer = viewer;
					//console.log(this.viewer.showMarkersList);
					this.pano = res[0];
					resolve();
				});
			});
		});
	}	
}