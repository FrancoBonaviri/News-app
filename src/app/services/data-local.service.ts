import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'
import { Article } from '../interfaces/interfaces';
import { NoticiaComponent } from '../components/noticia/noticia.component';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  favoritos: Article[] = [];
  constructor(private storage: Storage) { this.cargarfavoritos() }


  guardarfavoritos(noticia: Article){
    const existe = this.favoritos.find(noti => noti.title === noticia.title);
    if( !existe ){
      this.favoritos.unshift( noticia ); //Guardo en el arreglo de noticias la noticia agregada
      this.storage.set('favoritos', this.favoritos); //La guardo en el ionic storage
    }

  }
  async cargarfavoritos(){
    const favs = await this.storage.get( 'favoritos' ); //Obtengo el arreglo de noticias en el ionicStorage al iniciar el servicio
    
    if( favs ){
      this.favoritos = favs; //Si el arreglo no es null, se lo asigno a la variable local para que no de errores en el filtrado de guadarFavoritos()
    }
  }
  borrarNoticia(noticia: Article){
    this.favoritos = this.favoritos.filter( not => not.title !== noticia.title );  //Agarro el arreglo de noticias y lo filtro de modo tal que sean DISTINTAS A LA QUE LLEGA POR PARAMETRO
    this.storage.set('favoritos', this.favoritos); //Guardo el arreglo ya filtrado
  }

}
