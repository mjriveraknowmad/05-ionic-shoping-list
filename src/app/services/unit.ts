import { inject, Service, signal } from '@angular/core';
import { SqlliteManager } from './sqllite-manager';
import { IUnit } from '../models/unit.model';

@Service()
export class Unit {
  private sqlliteManager = inject(SqlliteManager);
  private _units = signal<IUnit[]>([]);
  public units = this._units.asReadonly();

  getUnits() {
    const statement = 'SELECT * FROM units ORDER BY description';
    this._units.set([]);
    return this.sqlliteManager
      .executeQuery(statement)
      .then((responseValue: any[] | undefined) => {
        if (responseValue) {
          responseValue.forEach((item) => {
            this._units.update((units) => [...units, item]);
          });
        }
        return this._units();
      });
  }
}
