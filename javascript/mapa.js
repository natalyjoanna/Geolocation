import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { easeOut } from "ol/easing.js";
import { fromLonLat } from "ol/proj.js";
import { getVectorContext } from "ol/render.js";
import { unByKey } from "ol/Observable.js";


const view = new View({
  center: [-11322443.92342625,2410065.884843269],
  zoom: 13,
  multiWorld: true,
});

const tileLayer = new TileLayer({
  source: new OSM({
    wrapX: false,
  }),
});

const source = new VectorSource({
  wrapX: false,
});
const vector = new VectorLayer({
  source: source,
});

const map = new Map({
  layers: [tileLayer, vector],
  target: "map",
  view: view,
});



// Mis coordenadas


const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
  tracking: true,
});



geolocation.on('error', function (error) {
  const info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 8,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 1,
      }),
    }),
  })
);

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});



// Coordenadas segundo punto

const latitud = Number(localStorage.getItem('latitud'));
const longitud = Number(localStorage.getItem('longitud'));
const nombre = localStorage.getItem('nombre');

console.log(latitud,longitud,nombre);

const newPosition = new Point(fromLonLat([longitud,latitud]))

const deliveryFeature = new Feature(newPosition);
deliveryFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 8,
      fill: new Fill({
        color: "#876da1"
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 1,
      })
    })
  })
);

source.addFeature(deliveryFeature);

const nom = document.getElementById('nombreCoor');
nom.innerHTML = nombre;

/*
const API_URL = "http://localhost:4000/cities";
const xhr = new XMLHttpRequest();

async function onRequestHandler(){
  if(this.readyState == 4 && this.status == 200){
    console.log(this.response);
    const data = JSON.parse(this.response);
    while(true){
      console.log('calling json map');
      data.map(city => addCityFeature(city.longitude,city.latitude));
      await sleep(4000);
    }
  }
}

xhr.addEventListener("load", onRequestHandler);
xhr.open("GET",API_URL);
xhr.send();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/
//function addFixedFeature() {
//  const coordinates = [longitud,latitud];
//  const geom = new Point(coordinates);
//  const feature = new Feature(geom);
//  source.addFeature(feature);
//}

/*
const duration = 3000;
function flash(feature) {
  const start = Date.now();
  const flashGeom = feature.getGeometry().clone();
  const listenerKey = tileLayer.on("postrender", animate);

  function animate(event) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    if (elapsed >= duration) {
      unByKey(listenerKey);
      return;
    }
    const vectorContext = getVectorContext(event);
    const elapsedRatio = elapsed / duration;
    // radius will be 5 at start and 30 at end.
    const radius = easeOut(elapsedRatio) * 25 + 5;
    const opacity = easeOut(1 - elapsedRatio);
    const style = new Style({
      image: new CircleStyle({
        radius: radius,
        stroke: new Stroke({
          color: "rgba(255, 0, 0, " + opacity + ")",
          width: 0.25 + opacity,
        }),
      }),
    });

    vectorContext.setStyle(style);
    vectorContext.drawGeometry(flashGeom);
    // tell OpenLayers to continue postrender animation
    map.render();
  }
}

source.on("addfeature", function (e) {
  flash(e.feature);
});

//window.setInterval(addRandomFeature, 1000);
//addFixedFeature();
//window.setInterval(addFixedFeature, 5000);
/*
function addCityFeature(longitude, latitude) {
  addFromLonLatFeature(longitude, latitude);
  window.setInterval(addFromLonLatFeature, 5000);
}

/*function addFromLonLatFeature(longitude, latitude) {
  const x = longitude;
  const y = latitude;
  const geom = new Point(fromLonLat([x, y]));
  const feature = new Feature(geom);
  source.addFeature(feature);
}*/





