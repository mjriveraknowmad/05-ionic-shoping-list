import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular';
import { SqlliteManager } from './services/sqllite-manager';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppComponent implements OnInit {
  private platform = inject(Platform);
  private sqliteManager = inject(SqlliteManager);
  isWeb = this.sqliteManager.isWeb;
  isReady = this.sqliteManager.isReady;

  ngOnInit() {
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(() => {
      this.sqliteManager.init();
    });
  }
}
