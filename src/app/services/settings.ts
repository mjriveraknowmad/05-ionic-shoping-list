import { inject, Service } from '@angular/core';
import { SqlliteManager } from './sqllite-manager';

@Service()
export class Settings {
  private sqlliteManager = inject(SqlliteManager);

  getSettingByKey(key: string) {
    const selectKey = `SELECT value FROM settings WHERE key=?`;
    const value = [key];
    return this.sqlliteManager
      .executeQuery(selectKey, value)
      .then((result) => result?.[0]?.value as string ?? '');
  }

  updateSettingByKey(key: string, value: string) {
    const statement = `UPDATE settings SET value=? WHERE key=?`;
    const values = [value, key];
    return this.sqlliteManager.executeInstruction(statement, values);
  }
}
