import { inject, Service, signal } from '@angular/core';
import { IUnit } from '../models/unit.model';
import { SqlliteManager } from './sqllite-manager';
import { IItem } from '../models/item.model';

@Service()
export class Item {
  private sqlliteManager = inject(SqlliteManager);

  createItem(item: IItem) {
    const statement = `
      INSERT INTO items (description, quantity, unit, checked)
      VALUES (?, ?, ?, ?)
    `;
    const values = [item.description, item.quantity, item.unit, false];
    return this.sqlliteManager
      .executeInstruction(statement, values)
      .then((changes) => {
        console.log('Item created successfully', changes);
        return changes;
      })
      .catch((error) => {
        console.error('Error creating item:', error);
      });
  }
}
