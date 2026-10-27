import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { FormItemComponent } from '../../components/form-item/form-item.component';
import { IGroupedItem } from '../../models/item.model';
import { Item } from '../../services/item';
import { Toast } from '../../services/toast';

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
    IonIcon,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonText
],
})
export class ShopingListPage {
  private injector = inject(Injector);
  private modalCtrl = inject(ModalController);
  private itemSvc = inject(Item);
  private toastSvc = inject(Toast);
  private items = this.itemSvc.items;
  public groupItems = signal<IGroupedItem[]>([
    { name: 'Pendientes', items: [] },
    { name: 'Completados', items: [] },
  ]);

  constructor() {
    addIcons({
      addOutline,
    });
  }

  ionViewWillEnter() {
    this.itemSvc.getItems();
    effect(() => {
      this.groupItems.set([
        { name: 'Pendientes',  items: this.items().filter(item => !item.checked) },
        { name: 'Completados', items: this.items().filter(item => item.checked) },
      ]);
    },{
      injector: this.injector
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormItemComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75], // hasta donde se puede expandir/encojer el modal, al no poner "1" no se puede expandir a pantalla completa
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.itemSvc
        .createItem(data)
        .then(() => {
          this.toastSvc.showToast(
            `Producto ${data.description} añadido correctamente`
          );
        })
        .catch((error) => {
          this.toastSvc.showToast('Error adding item');
        });
    }
  }
}
