import {AfterViewInit, Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {circleMarker, latLng, LatLngBounds, LayerGroup, layerGroup, Map, tileLayer} from 'leaflet';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements AfterViewInit {
  options = {
    layers: [
      tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 5,
    center: latLng([46.879966, -121.726909])
  };
  private map!: Map;
  private markerGroup: LayerGroup | null = null;

  constructor(private readonly httpClient: HttpClient) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.map.invalidateSize(), 10);
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.loadEarthquakes(map.getBounds());

    map.on('zoomend', evt => this.loadEarthquakes(evt.target.getBounds()));
    map.on('moveend', evt => this.loadEarthquakes(evt.target.getBounds()));
  }

  private loadEarthquakes(bounds: LatLngBounds): void {
    const wrappedBounds = this.map.wrapLatLngBounds(bounds);
    const southWest = wrappedBounds.getSouthWest();
    const northEast = wrappedBounds.getNorthEast();
    this.httpClient.get<Earthquake[]>(`http://127.0.0.1:8080/earthquakes/${southWest.lng}/${southWest.lat}/${northEast.lng}/${northEast.lat}`)
      .subscribe(data => this.drawCircles(data));
  }

  private drawCircles(earthquakes: Earthquake[]): void {
    if (this.markerGroup) {
      this.markerGroup.removeFrom(this.map);
    }
    this.markerGroup = layerGroup().addTo(this.map);
    for (const earthquake of earthquakes) {
      const info = `${earthquake.time}<br>${earthquake.place}<br>${earthquake.mag}`;

      circleMarker([earthquake.location.coordinates[1], earthquake.location.coordinates[0]], {
        color: '#000000',
        fillOpacity: 0.4,
        fillColor: this.getFillColor(earthquake.mag),
        weight: 1,
        radius: earthquake.mag * this.map.getZoom()
      })
        .bindPopup(info)
        .addTo(this.markerGroup);
    }
  }

  private getFillColor(mag: number): string {
    if (mag < 3) {
      return '#FFC0CB';
    } else if (mag < 4) {
      return '#F88379';
    } else if (mag < 5) {
      return '#FF0000';
    } else if (mag < 6) {
      return '#ED1C24';
    } else if (mag < 7) {
      return '#C40233';
    }
    return '#960018';
  }
}

interface Earthquake {
  time: string;
  place: string;
  mag: number;
  location: {
    coordinates: number[]
  };
}
