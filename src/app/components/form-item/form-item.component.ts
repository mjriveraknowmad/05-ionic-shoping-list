import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonTitle, IonToolbar, ModalController, IonGrid, IonRow, IonCol, IonSelectOption, IonSelect } from '@ionic/angular';
import { IItem } from '../../models/item.model';
import { Unit } from '../../services/unit';

@Component({
  selector: 'app-modal-example',
  templateUrl: 'form-item.component.html',
  imports: [FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonSelectOption, IonSelect],
})
export class FormItemComponent {
  private modalCtrl = inject(ModalController);
  private unitSvc = inject(Unit);
  public units = this.unitSvc.units;
  public item: IItem = {
    description: '',
    quantity: 1,
    checked: false
  }

  ngOnInit() {
    this.unitSvc.getUnits();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.item, 'confirm');
  }
}
