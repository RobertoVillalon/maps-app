import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.MAPBOX_TOKEN;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.css',
})
export class FullscreenMapPageComponent implements AfterViewInit{
  divElement = viewChild<ElementRef>('map')
  map = signal<mapboxgl.Map | null>(null)
  zoom = signal(14)
  coordinates = signal({
    lat: 40,
    lng: -74.5
  })

  zoomEffect = effect(() => {
    if(!this.map()) return

      this.map()?.setZoom(this.zoom())
    })

  async ngAfterViewInit(){
    if(!this.divElement()?.nativeElement ) return
    const element = this.divElement()!.nativeElement

    await new Promise((resolve) => setTimeout(resolve, 80))

    const map = new mapboxgl.Map({
      container: element, 
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.coordinates().lng, this.coordinates().lat], 
      zoom: this.zoom(),
    });

    this.mapListeners(map)
  }

  mapListeners(map: mapboxgl.Map){
    
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom()
      this.zoom.set(newZoom)
    })

    map.on('moveend', (event) => {
      const center = map.getCenter();
      this.coordinates.set(center);
    })

    map.addControl(new mapboxgl.FullscreenControl)
    map.addControl(new mapboxgl.GeolocateControl)
    map.addControl(new mapboxgl.NavigationControl)
    
    this.map.set(map)
  }

}
