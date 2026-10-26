import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, capSQLiteResult } from '@capacitor-community/sqlite'
import { database } from '../../assets/db/db.json';

@Injectable({
  providedIn: 'root'
})
export class SqlliteManager {

  private platform: Platform = inject(Platform)

  private _isWeb = signal(false);
  private _isIos = signal(false);
  private _isReady = signal(false);

  public isWeb = this._isWeb.asReadonly();
  public isIos = this._isIos.asReadonly();
  public isReady = this._isReady.asReadonly();

  private readonly DB_NAME = database;

  async init(){

    if(this.platform.is('desktop')){
      this._isWeb.set(true);
      await CapacitorSQLite.initWebStore();
    }else if(this.platform.is('ios')){
      this._isIos.set(true);
    }

    const databaseExists: capSQLiteResult = await CapacitorSQLite.isDatabase({ database: this.DB_NAME })

    if(!databaseExists.result){
      await this.downloadDatabase();
    }

    await this.connectDatabase();

  }

  downloadDatabase(){

    fetch('assets/db/db.json').then( async (value: Response) => {

      const jsonstring = await value.text();

      const isValid = await CapacitorSQLite.isJsonValid({
        jsonstring
      })

      if(isValid.result){
        await CapacitorSQLite.importFromJson({ jsonstring })
      }

    })

  }

  async connectDatabase(){
    await CapacitorSQLite.createConnection({ database: this.DB_NAME });
    await CapacitorSQLite.open({ database: this.DB_NAME })
    this._isReady.set(true);
  }


}
