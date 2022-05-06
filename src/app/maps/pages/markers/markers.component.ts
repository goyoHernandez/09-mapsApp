import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string,
  marker?: mapboxgl.Marker,
  coordinates?: [number, number]
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [
    `
    .map-container {
            width: 100%;
            height: 100%;
          }
    
    .marker{
      position: fixed;
      top: 50px;
      right: 20px;
      z-index: 999;
    }

    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarkersComponent implements AfterViewInit {
  map!: mapboxgl.Map;
  @ViewChild('mapMarker') mapMarker!: ElementRef;
  zoomLevel: number = 15;
  coordinates: [number, number] = [-98.39827371779113, 19.312910734364277];
  markers: MarkerColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {

    this.map = new mapboxgl.Map({
      container: this.mapMarker.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.coordinates, // starting position [lng, lat]
      zoom: this.zoomLevel // starting zoom
    });

    this.ReadMarkersLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hepaa';

    // const marker = new mapboxgl.Marker({
    //   element: markerHtml
    // })
    //   .setLngLat(this.coordinates)
    //   .addTo(this.map);


  }

  GoToMarker = (marker: mapboxgl.Marker) => {
    this.map.flyTo({
      center: marker.getLngLat()
    });
  }

  AddMarker = () => {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.coordinates)
      .addTo(this.map);

    this.markers.push({
      color,
      marker: newMarker
    });

    this.SaveMarkersLocalStorage();

    newMarker.on('dragend', (e) => {
      this.SaveMarkersLocalStorage();
    });
  }

  SaveMarkersLocalStorage = () => {
    const lngLatArr: MarkerColor[] = [];

    this.markers.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        coordinates: [lng, lat]
      });

    });
    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  ReadMarkersLocalStorage = () => {
    if (!localStorage.getItem('markers'))
      return;

    const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('markers')!);

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.coordinates!)
        .addTo(this.map);

      this.markers.push({
        color: m.color,
        marker: newMarker
      });

      newMarker.on('dragend', (e) => {
        this.SaveMarkersLocalStorage();
      });
    });
  }

  RemoveMarker = (index: number) => {
    this.markers[index].marker?.remove();
    this.markers.splice(index, 1);
    this.SaveMarkersLocalStorage();
  }
}
