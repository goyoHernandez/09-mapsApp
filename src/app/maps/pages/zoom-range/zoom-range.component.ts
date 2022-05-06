import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
     .map-container {
            width: 100%;
            height: 100%;
          }
     
    .row {
      width: 400px;
       background-color: white;
       bottom: 50px;
       left: 50px;
       padding:10px;
       position: fixed;
       border-radius: 5px;
       z-index: 999;
     }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  map!: mapboxgl.Map;
  @ViewChild('mapZoomRange') mapZoomRange!: ElementRef;
  zoomLevel: number = 10;
  coordinates: [number, number] = [-98.39827371779113, 19.312910734364277];

  constructor() { }

  ngOnDestroy(): void {
    this.map.off('zoom', () => { });
    this.map.off('zoomend', () => { });
    this.map.off('move', () => { });
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapZoomRange.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.coordinates, // starting position [lng, lat]
      zoom: this.zoomLevel // starting zoom
    });

    //Zoom del mapa
    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
    });

    //Zoom final del mapa
    this.map.on('zoomend', (ev) => {
      if (this.map.getZoom() > 18)
        this.map.zoomTo(18);
    });

    //Movimiento del mapa
    this.map.on('move', (ev) => {
      const { lng, lat } = ev?.target.getCenter();
      this.coordinates = [lng, lat];
    });
  }

  ZoomOut = () => {
    this.map.zoomOut();
  }

  ZoomIn = () => {
    this.map.zoomIn();
  }

  ZoomChange = (value: string) => {
    this.map.zoomTo(Number(value));
  }
}
