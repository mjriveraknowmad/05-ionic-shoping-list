import { IUnit } from './unit.model';

export interface IItem {
  id?: number;
  description: string;
  quantity: number;
  unit?: IUnit;
  checked: boolean;
}
