import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { IItem } from '../../models/item.model';

@Component({
  selector: 'app-modal-example',
  templateUrl: 'form-item.component.html',
  imports: [FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonTitle, IonToolbar],
})
export class FormItemComponent {
  name = signal('');
  private modalCtrl = inject(ModalController);
  public item: IItem = {
    description: '',
    quantity: 1,
    checked: false
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
