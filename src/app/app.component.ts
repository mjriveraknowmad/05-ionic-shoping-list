import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Injector, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, LoadingController, Platform } from '@ionic/angular';
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
  private injector = inject(Injector);
  private sqliteManager = inject(SqlliteManager);
  public loadingCtrl = inject(LoadingController);
  isWeb = this.sqliteManager.isWeb;
  isReady = this.sqliteManager.isReady;

  ngOnInit() {
    this.initApp();
  }

  async initApp() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...'
    });
    await loading.present();

    this.platform.ready().then(() => {
      this.sqliteManager.init();
    });

    effect(() => {
      if(this.isReady()){
        loading.dismiss();
      }
    },{
      injector: this.injector
    });
  }
}
