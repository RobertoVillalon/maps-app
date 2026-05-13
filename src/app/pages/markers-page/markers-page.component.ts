import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { v4 as UUIDv4} from 'uuid'
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.MAPBOX_TOKEN;

interface Marker {
  id: string,
  mapBoxMarker: mapboxgl.Marker
}

@Component({
  selector: 'app-markers-page',
  imports: [DecimalPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit{
  divElement = viewChild<ElementRef>('map')
  map = signal<mapboxgl.Map | null>(null)
  markers = signal<Marker[]>([])
  
  async ngAfterViewInit(){
    if(!this.divElement()?.nativeElement ) return
    const element = this.divElement()!.nativeElement

    await new Promise((resolve) => setTimeout(resolve, 80))

    const map = new mapboxgl.Map({
      container: element, 
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-71.21348118350552, -29.91999396233657], 
      zoom: 15,
    });

    this.mapListeners(map)
  }

  mapListeners(map: mapboxgl.Map){

    map.on('click', (e) =>  this.setMarker(e))

    this.map.set(map)
  }

  setMarker(event: mapboxgl.MapMouseEvent){
    const randomColor = '#xxxxxx'.replace(/x/g, (y) =>((Math.random() * 16) | 0).toString(16));
    if(!this.map() ) return

    const marker = new mapboxgl.Marker({
      draggable: false,
      color: randomColor,
      clickTolerance: .1
    }).setLngLat(event.lngLat).addTo(this.map()!)

    marker.getElement().addEventListener('contextmenu', () => this.deleteMarker(marker))

    const newMarker: Marker = {
      id: UUIDv4(),
      mapBoxMarker: marker
    } 

    this.markers.update((markers) => [newMarker, ...markers])
  }

  deleteMarker(marker: mapboxgl.Marker){

    this.markers.set(this.markers().filter((m) => m.mapBoxMarker !== marker))

    marker.remove()
  }

  flyToMarker(lngLat: LngLatLike){
    if(!this.map() ) return

    this.map()?.flyTo({
      center: lngLat
    })
  }
}