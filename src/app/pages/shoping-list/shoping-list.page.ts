import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonItem, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { FormItemComponent } from '../../components/form-item/form-item.component';

@Component({
  selector: 'app-shoping-list',
  templateUrl: './shoping-list.page.html',
  styleUrls: ['./shoping-list.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonIcon
],
})
export class ShopingListPage implements OnInit {
  private modalCtrl = inject(ModalController);
  public message = signal('');
  constructor() {
    addIcons({
      addOutline
    });
  }

  ngOnInit() {
    console.log('ShopingListPage initialized');
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormItemComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75] // hasta donde se puede expandir/encojer el modal, al no poner "1" no se puede expandir a pantalla completa
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message.set(`Hello, ${data()}!`);
    }
  }
}
