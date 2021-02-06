import { Component, ViewChild, OnInit, ɵConsole } from '@angular/core';
import { IonSegment, IonContent } from '@ionic/angular';
import { NoticiasService } from '../../services/noticias.service';
import { Article } from 'src/app/interfaces/interfaces';
import { Tab1PageRoutingModule } from '../tab1/tab1-routing.module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  noticias: Article[] = [];
  @ViewChild(IonSegment, {static:true}) segmento: IonSegment;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  categorias = ['Business','Entertainment','General','Health','Cience','Sports','Technology'];



  constructor( private dataService: NoticiasService) {}

  ngOnInit(){
    this.segmento.value = this.categorias[0]; //Al cargar la pagina Fijo el el segmento seleccioado por defecto 

    //A su vez  llamo a los servicios de la api de la categoria de los elemento seleccionado, y lo cargo
    this.cargarNoticias(this.categorias[0]);
  }

  //Metodo que al cambiar el IONCHANGE cambia el la categoria del array mediante las peticiones a la api
  cambioCategoria(event){
    this.noticias = []; //Limpia el arreglo para cambiar una categoria distinta (Este evento (ionchange) se ejecuta cuando CAMBIAMOS DE CATEGORIA)
    this.cargarNoticias(event.detail.value)
    this.content.scrollToTop();
  }


  cargarNoticias( categoria: string, event? ){
    //Si el arreglo el mayor a 70 unidades, finalizo la cargar
    if(this.noticias.length >= 70){
      event.target.complete();
      event.target.disabled=true;
    }
    else{
      //Llamo a los servicios de la api de la categoria de los elemento seleccionado, y lo cargo
      this.dataService.getTopHeadLinesCategorias(categoria).subscribe(resp =>{
        this.noticias.push(...resp.articles);
        console.log(this.noticias)
        
        if(event){
          event.target.complete(); //Si el evento existe, el infinite scroll se detiene y se vuelve a llamar cuando llega al final nuevamente
        }
        if(resp.articles.length === 0){ //Caundo el servicio me devuelve el array vacio ya no hay mas data que ver, por ende "Saco" el InfiniteScroll
          event.target.desabled=true;
        }

      })
    }
  }

  ///Evento del Infite Scroll
  loadData( event ){
    this.cargarNoticias(this.segmento.value, event)
  }
}
