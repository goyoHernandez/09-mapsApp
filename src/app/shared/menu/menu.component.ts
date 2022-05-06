import { Component, OnInit } from '@angular/core';

interface MenuItem {
  route: string,
  name: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor() { }

  menuItems: MenuItem[] = [
    {
      route: '/maps/fullscreen',
      name: 'fullscreen'
    },
    {
      route: '/maps/zoom-range',
      name: 'zoom-range'
    },
    {
      route: '/maps/markers',
      name: 'markers'
    },
    {
      route: '/maps/properties',
      name: 'properties'
    }
  ]
}
