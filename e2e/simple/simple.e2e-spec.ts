import { SimplePage } from './simple.po';
import { browser } from 'protractor';
import { Key } from 'selenium-webdriver';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { heroes, filter } from '../../example/data/hero';

jasmine.getEnv().addReporter({
  specDone: ({ id, fullName }) => {
    browser.takeScreenshot().then(screenshot => {
      const folder = join(__dirname, 'screenshots');
      if (!existsSync(folder)) {
        mkdirSync(folder);
      }
      var stream = createWriteStream(join(folder, `${id}-${fullName.replace(/\s+/g, '-').toLowerCase()}.png`));
      stream.write(new Buffer(screenshot, 'base64'));
      stream.end();
    });
  },
});

const page = new SimplePage();
const query = 'm';
const heroesFiltered = filter(heroes, query);

describe('Frontal simple', function() {
  page.navigateTo();

  it('should initialize with a closed menu', () => {
    expect(page.getMenu().isPresent()).toBeFalsy();
  });

  it('should show the menu on input', () => {
    page.getInput().sendKeys(query);
    expect(page.getMenu().isPresent()).toBeTruthy();
  });

  describe('move its highlighted index on arrow usages', () => {
    describe('arrow down', () => {
      it('should move down', () => {
        expect(page.getHighlightedItem().isPresent()).toBeFalsy();
        page.getInput().sendKeys(Key.DOWN);
        expect(page.getHighlightedItem().isPresent()).toBeTruthy();
        expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[0].name);
        page.getInput().sendKeys(Key.DOWN);
        page.getInput().sendKeys(Key.DOWN);
        expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[2].name);
      });

      it('should move to the top if the last item is selected', () => {
        page.getInput().sendKeys(Key.DOWN);
        expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[0].name);
      });
    });

    describe('arrow up', () => {
      it('should move to the bottom if the first item is selected', () => {
        page.getInput().sendKeys(Key.UP);
        expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[2].name);
      });

      it('should move up', () => {
        page.getInput().sendKeys(Key.UP);
        expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[1].name);
      });
    });

    describe;
  });

  describe('press enter', () => {
    it('should select the highlighted item', () => {
      page.getInput().sendKeys(Key.ENTER);
      expect(page.getSelectedItem().getAttribute('value')).toBe(JSON.stringify(heroesFiltered[1]));
    });

    it('should set the input value', () => {
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[1].name);
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });

  describe('press escape', () => {
    it('should do nothing', () => {
      page.getInput().sendKeys(Key.ESCAPE);
      expect(page.getMenu().isPresent()).toBeFalsy();
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[1].name, 'because the menu is closed');
    });

    it('should clear the selected item', () => {
      page.getInput().clear();
      page.getInput().sendKeys(query);
      page.getInput().sendKeys(Key.ESCAPE);
      expect(page.getSelectedItem().getAttribute('value')).toBe('null');
    });

    it('should clear the input', () => {
      expect(page.getInput().getAttribute('value')).toBe('');
    });

    it('should close the menu', () => {
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });

  describe('mouse movements in an open menu', () => {
    it('should highlight an item on enter', () => {
      page.getInput().clear();
      page.getInput().sendKeys(query);
      browser
        .actions()
        .mouseMove(page.getSecondInMenu())
        .perform();
      expect(page.getHighlightedItem().isPresent()).toBeTruthy();
      expect(page.getHighlightedItem().getText()).toBe(heroesFiltered[1].name);
    });

    it('should select the highlighted item on click', () => {
      browser
        .actions()
        .click()
        .perform();
      expect(page.getSelectedItem().getAttribute('value')).toBe(JSON.stringify(heroesFiltered[1]));
      expect(page.getInput().getAttribute('value')).toBe(heroesFiltered[1].name);
      expect(page.getMenu().isPresent()).toBeFalsy();
    });
  });
});
