import { CommonModule } from '@angular/common';
import { Component, effect, inject, Injector, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline } from 'ionicons/icons';
import { FormItemComponent } from '../../components/form-item/form-item.component';
import { IGroupedItem, IItem } from '../../models/item.model';
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
    IonText,
    IonCheckbox,
    IonButton,
    IonSearchbar,
  ],
})
export class ShopingListPage {
  private injector = inject(Injector);
  private modalCtrl = inject(ModalController);
  private alertController = inject(AlertController);
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
      closeOutline,
    });

    effect(() => {
      const currentItems = this.items();
      this.groupItems.set([
        { name: 'Pendientes', items: currentItems.filter((item) => !item.checked) },
        { name: 'Completados', items: currentItems.filter((item) => item.checked) },
      ]);
      console.log('items updated:', currentItems);
    }, {
      injector: this.injector
    });
  }

  ionViewWillEnter() {
    this.itemSvc.getItems();
  }

  updateItem(item: IItem) {
    this.itemSvc.updateItem(item).then(() => {
      console.log(this.items());
      this.toastSvc.showToast(
        `Producto ${item.description} actualizado correctamente`
      );
    });
  }

  confirmDelete(item: IItem) {
    this.alertController.create({
      header: 'Borrar el producto',
      message: `¿Estás seguro de que deseas borrar el producto ${item.description}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          role: 'confirm',
          handler: () => {
            this.deleteItem(item);
          }
        }
      ]
    }).then(alert => alert.present());
  }


  deleteItem(item: IItem) {
    this.itemSvc.deleteItem(item).then(() => {
      console.log(this.items());
      this.toastSvc.showToast(
        `Producto ${item.description} eliminado correctamente`
      );
    });
  }

  filterItems(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.trim() || '';
    this.itemSvc.getItems(query);
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
