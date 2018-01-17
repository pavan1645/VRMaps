export function addMarkers(viewer, id) {
	viewer.clearMarkers();
	viewer.addMarker({
		id:'pano',
		circle: 20,
		anchor: "0% 0%",
		latitude: -0.14789787378735442,
		longitude: 3.516494271989191,
		svgStyle: {
			fill: 'rgba(250, 0, 0, 0.3)'
		},
		tooltip: {
			content: 'go back',
			position: 'top center'
		}
	});
}