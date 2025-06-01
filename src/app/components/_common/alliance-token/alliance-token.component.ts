import { Component, Input } from '@angular/core';
import { Faction } from 'src/app/models';

@Component({
    selector: 'dune-alliance-token',
    templateUrl: './alliance-token.component.html',
    styleUrls: ['./alliance-token.component.scss'],
    standalone: false
})
export class AllianceTokenComponent {
  @Input() faction: Faction = {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginTop: 16,
      marginLeft: 16,
      width: 600,
    },
    actionFields: [],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Fremen.png',
    primaryColor: '#63a8ff',
    secondaryColor: '#5b81df',
  };

  @Input() width: number = 130;
  @Input() height: number = 130;
  @Input() customColor: string = '';
}
