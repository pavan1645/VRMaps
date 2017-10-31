window.onload = function() {
    //document.getElementById('pano').addEventListener('change', upload, false);
    var div = document.getElementById('your-pano');
    var PSV = new PhotoSphereViewer({
        panorama: "./index_files/pano.jpg",
        container: div,
        time_anim: false,
        navbar: true,
        size: {
            width: '100%',
            height: '600px'
        },
        usexmpdata: false
    });

    PSV.on('click', function(e) {
       
    });
};
