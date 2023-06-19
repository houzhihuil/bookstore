function initialiserCarte (){
   if(!navigator.geolocation) {
    return false;
   }
   var centreGoogleMap = new google.maps.LatLng (45.483294, -73.868898);
   var optionsGoogleMap = {
    // facteur de zoom
    zoom : 15,
    //point de centrage
    center : centreGoogleMap,
    /* Mode d,affichage de la carte (vue carte routiere)
    google.maps.mapTypeId.ROADMAP: affichage en mode plan
    google.maps.mapTypeId.TERRAIN: affichage en mode Relief
    google.maps.mapTypeId.SATELLITE: affichage en mode satellite
    google.maps.mapTypeId.HYBRID: affichage en mode plan et satellite */
    mapTypeId: google.maps.MapTypeId.ROADMAP
   };
    var maCarte = new google.maps.Map(document.getElementById("maCarte"), optionsGoogleMap);
    var markerGG = new google.maps.Marker({
        position : {lat:45.483294,  lng: -73.868898},
        map: maCarte,
        //icon:'https://img.icons8.com/fluent/48/000000/marker-storm.png',
        // adding custom icons (Here I used a Flash logo marker)
        draggarble: false,// If set to true you can drag the marker
        title: "BrooketCo"//College GeraldGodin
    });

    var commentarieGG = "<div>";
    commentarieGG += "<h1>BrooketCo</h1>";
    commentarieGG += "La plus grande librairie à l'Ouest de Montréal";
    commentarieGG += "</div>";
    var fenetreGG = new google.maps.InfoWindow({
        content : commentarieGG
    });
    google.maps.event.addListener(markerGG, "click", function(){
        fenetreGG.open(maCarte, markerGG);
    }); 
}
