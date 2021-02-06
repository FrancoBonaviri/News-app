import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from '../../services/data-local.service';
import { environment } from '../../../environments/environment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() indice: number;
  @Input() enFavs;
  constructor(private inAppBrowser: InAppBrowser,
              private actionSheetCrtl: ActionSheetController,
              private socialSharing: SocialSharing,
              private dataLocalService: DataLocalService,
              public toastCtrl: ToastController) { }

  ngOnInit() {}

  AbrirNoticia(){
    const browser = this.inAppBrowser.create(this.noticia.url,'_system');
  }

  async lanzarMenu(){
    let guardarBorrarBtn;
    if(this.enFavs)
    {
      guardarBorrarBtn = {
        text: 'Borrar de Favoritos',
        icon: 'trash',
        cssClass: "action-dark",
        handler: () => {
          console.log('Delete Favs');
          this.dataLocalService.borrarNoticia( this.noticia );
          this.presentToast('Removed from Favorites');
        }
      };
    }
     else 
    {
      guardarBorrarBtn = {
        text: 'Favoritos',
        icon: 'star',
        cssClass: "action-dark",
        handler: () => {
          console.log('Favorite Clicked');
          this.dataLocalService.guardarfavoritos( this.noticia );
          this.presentToast('Saved to favorites');
        }
      };
    }


    const actionSheet = await this.actionSheetCrtl.create({
      buttons: [
      {
        text: 'Compartir',
        icon: 'share',
        cssClass: "action-dark",
        handler: () => {
          console.log('Share clicked');
          this.socialSharing.share(
            this.noticia.title,
            this.noticia.source.name,
            '',
            this.noticia.url
          );
        }
      }, 
      guardarBorrarBtn
      ]
    });
    actionSheet.mode = "ios";
    await actionSheet.present();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      message,
      duration: 2000
    });
    toast.present();
  } 
}
