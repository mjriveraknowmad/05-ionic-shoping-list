import { Directive, HostListener, input, OnInit, output } from '@angular/core';
import { Theme } from '../models/types';

@Directive({
  selector: '[appToggleTheme]',
  host: {
    '(click)': 'switchTheme()'
  }
})
export class ToggleTheme implements OnInit {

  themeInitial = input<Theme>();
  themeSelected = output<Theme>();

  ngOnInit() {
    if(this.themeInitial() === 'dark') {
      this.switchTheme(false);
    }
  }

  switchTheme(emitTheme = true) {
    const ionAppComponent = document.querySelector('ion-app');
    if (ionAppComponent) {
      const beforeIsDark = ionAppComponent.classList.contains('ion-palette-dark');
      ionAppComponent.classList.toggle('ion-palette-dark');

      if(!emitTheme) return;
      if(beforeIsDark) {
        this.themeSelected.emit('light');
      } else {
        this.themeSelected.emit('dark');
      }
    }
  }
}
