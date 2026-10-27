import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, capSQLiteResult } from '@capacitor-community/sqlite';
import { database } from '../../assets/db/db.json';

@Injectable({
  providedIn: 'root',
})
export class SqlliteManager {
  private platform: Platform = inject(Platform);

  private _isWeb = signal(false);
  private _isIos = signal(false);
  private _isReady = signal(false);

  public isWeb = this._isWeb.asReadonly();
  public isIos = this._isIos.asReadonly();
  public isReady = this._isReady.asReadonly();

  private readonly DB_NAME = database;

  private databaseExists?: capSQLiteResult = undefined;

  async init() {
    this._isReady.set(false);
    if (this.platform.is('desktop')) {
      this._isWeb.set(true);
      await CapacitorSQLite.initWebStore();
    } else if (this.platform.is('ios')) {
      this._isIos.set(true);
    }

    if (!this.databaseExists) {
      this.databaseExists= await CapacitorSQLite.isDatabase({
        database: this.DB_NAME,
      });
    }

    if (!this.databaseExists.result) {
      await this.downloadDatabase();
    }

    await this.connectDatabase();
  }

  downloadDatabase() {
    fetch('assets/db/db.json').then(async (value: Response) => {
      const jsonstring = await value.text();

      const isValid = await CapacitorSQLite.isJsonValid({
        jsonstring,
      });

      if (isValid.result) {
        await CapacitorSQLite.importFromJson({ jsonstring });
      }
    });
  }

  async connectDatabase() {
     this._isReady.set(false);
    await CapacitorSQLite.createConnection({ database: this.DB_NAME });
    await CapacitorSQLite.open({ database: this.DB_NAME });
    this._isReady.set(true);
  }

  /**
   * Executes a SELECT query on the database.
   */
  executeQuery(statement: string, values: any[] = []) {
    return CapacitorSQLite.query({
      database: this.DB_NAME,
      statement,
      values,
    }).then((response) => {
      if (this.isIos()) {
        response.values?.shift();
      }

      return response.values;
    });
  }

  /**
   * Executes an INSERT INTO , UPDATE, or DELETE query on the database.
   */
  executeInstruction(statement: string, values: any[] = []) {
    return CapacitorSQLite.run({
      database: this.DB_NAME,
      statement,
      values,
    }).then((changes) => {
      if (this.isWeb()) {
        // En web no se refleja automáticamente los cambios en el almacenamiento local, por eso forzamos el guardado manualmente.
        CapacitorSQLite.saveToStore({
          database: this.DB_NAME,
        });
      }
      return changes;
    });
  }
}
