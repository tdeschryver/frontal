import { Component } from '@angular/core';
import { heroes, filter, toString, toJson, Hero } from '../../data/hero';

@Component({
  selector: 'frontal-simple',
  template: `
    <frontal>
      <ng-template let-value="inputValue" let-open="open" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
        <label>Select your hero!
          <input type="text" id="input" frontalInput/>
        </label>

        <ul *ngIf="open" class="menu">
          <li *ngFor="let hero of filteredHeroes(value); trackBy:trackHeroById; let index=index;"
            [class.highlight]="highlightedIndex === index">
            <div frontalItem [toString]="heroToString" [value]="hero">{{hero.name}}</div>
          </li>

          <div *ngIf="!filteredHeroes(value).length">
            No heroes found...
          </div>
        </ul>

        <h4>Selected hero:</h4>
        <input type="hidden" id="selected" [value]="heroToJson(selectedItem)">
        <pre>{{selectedItem | json}}</pre>
      </ng-template>
    </frontal>
  `,
  styles: [
    `
      .highlight {
        background: yellow;
      }
    `,
  ],
})
export class SimpleComponent {
  heroes = heroes;

  filteredHeroes(query: string) {
    return filter(this.heroes, query);
  }

  trackHeroById(index: number, hero: Hero) {
    return hero.id;
  }

  heroToString(hero: Hero) {
    return toString(hero);
  }

  heroToJson(hero: Hero) {
    return toJson(hero);
  }
}
