import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
import { HouseProperty, lngLat } from '../../../interfaces/houses.interfaces.';

/* 
  width: 100%;
  height: 260;
*/

mapboxgl.accessToken = environment.MAPBOX_TOKEN;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css',
})

export class MiniMapComponent implements AfterViewInit{
    divElement = viewChild<ElementRef>('map')
    map = signal<mapboxgl.Map | null>(null)
    zoom = signal(14)
    coordinates = input.required<lngLat>()

    async ngAfterViewInit(){
      if(!this.divElement()?.nativeElement ) return
      const element = this.divElement()!.nativeElement

      await new Promise((resolve) => setTimeout(resolve, 80))

      const map = new mapboxgl.Map({
        container: element, 
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this.coordinates().lng, this.coordinates().lat], 
        zoom: this.zoom(),
        interactive: false,
        pitch: 30
      });

      const randomColor = '#xxxxxx'.replace(/x/g, (y) =>((Math.random() * 16) | 0).toString(16));

      new mapboxgl.Marker({
        draggable: false,
        color: randomColor,
        clickTolerance: .1
      }).setLngLat(this.coordinates()).addTo(map)
    }
}
