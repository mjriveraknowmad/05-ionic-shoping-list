import { inject, Service, signal } from '@angular/core';
import { IUnit } from '../models/unit.model';
import { SqlliteManager } from './sqllite-manager';
import { IItem } from '../models/item.model';

@Service()
export class Item {
  private sqlliteManager = inject(SqlliteManager);
  private _items = signal<IItem[]>([]);
  public items = this._items.asReadonly();

  createItem(item: IItem) {
    const statement = `
      INSERT INTO items (description, quantity, unit, checked)
      VALUES (?, ?, ?, ?)
    `;
    const values = [item.description, item.quantity, this.getUnitId(item.unit), item.checked ? 1 : 0];
    return this.sqlliteManager
      .executeInstruction(statement, values)
      .then((changes) => {
        console.log('Item created successfully', changes);
        if(changes && changes.changes && changes.changes.lastId) {
          item.id = changes.changes.lastId;
          this._items.update(currentItems => [...currentItems, item]);
        }
        return changes;
      })
      .catch((error) => {
        console.error('Error creating item:', error);
      });
  }

  getItems() {
    const statement = `
      SELECT
      i.id, i.description, i.quantity, i.checked,
      u.id as unitId, u.description as unitDescription
      FROM items i LEFT JOIN units u ON i.unit = u.id
    `;
    this._items.set([]);
    return this.sqlliteManager
      .executeQuery(statement, [])
      .then((results: any[] | undefined) => {
        if (results) {
          return results.map( (row) =>{
            const item: IItem = {
              id: row.id,
              description: row.description,
              quantity: row.quantity,
              unit: row.unitId? {
                id: row.unitId,
                description: row.unitDescription
              } : undefined,
              checked: row.checked == 1
            };
            this._items.update(currentItems => [...currentItems, item]);
            console.log('Item retrieved:', row);
            return item;
          });
        }
        return [];
      })
      .catch((error) => {
        console.error('Error retrieving items:', error);
      });
  }

  updateItem(item: IItem) {
    const statement = `
      UPDATE items
      SET description = ?, quantity = ?, unit = ?, checked = ?
      WHERE id = ?
    `;
    const values = [
      item.description,
      item.quantity,
      this.getUnitId(item.unit),
      item.checked ? 1 : 0,
      item.id,
    ];

    return this.sqlliteManager
      .executeInstruction(statement, values)
      .then((changes) => {
        console.log('Item updated successfully', changes);
        if (changes?.changes?.changes) {
          this._items.update((currentItems) =>
            currentItems.map((i) => (i.id === item.id ? item : i))
          );
        }
        return changes;
      })
      .catch((error) => {
        console.error('Error updating item:', error);
      });
  }

  deleteItem(item: IItem) {
    const statement = `
      DELETE FROM items
      WHERE id = ?
    `;
    const values = [item.id];
    return this.sqlliteManager
      .executeInstruction(statement, values)
      .then((changes) => {
        console.log('Item deleted successfully', changes);
        this._items.update((currentItems) =>
          currentItems.filter((i) => i.id !== item.id)
        );
        return changes;
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  }

  private getUnitId(unit: IUnit | undefined): number | null {
    return typeof unit?.id === 'number' ? unit.id : null;
  }
}
