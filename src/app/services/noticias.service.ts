import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadLines } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;


const headers = new HttpHeaders({
  'X-Api-Key': apiKey,
});


@Injectable({
  providedIn: 'root'
})

//MUCHOS DE LOS PROBLEMAS DE CARGA DE NOTICIAS ES DEBIDO A QUE HAY MUCHAS LIMITACIONES CON EL SERVICIO DE WWW.NEWSAPI.COM (GRATUITO)

export class NoticiasService {

  headLinesPage = 0;
  categoriaActual= '';
  categoriaPage=0;
  constructor(private http: HttpClient) { }

  private ejecutarQuery<T>( query: string){
    query = apiUrl + query;

    return this.http.get<T>(query, {headers});
  }



  getTopHeadLines(){
    this.headLinesPage++;
    // return this.http.get<RespuestaTopHeadLines>(`http://newsapi.org/v2/top-headlines?country=us&apiKey=3765bf511747477b93e819389b94bbb6`)
    return this.ejecutarQuery<RespuestaTopHeadLines>(`/top-headlines?country=us&page=${this.headLinesPage}`)
  }
  
  getTopHeadLinesCategorias(categoria: string){
    //Filtro por categorias para que traiga pagina por pagina de cada una de las categorias (si catAct sigue siendo la misma, aumenta la pagina, sino, cambia catAct a la NuevaCat)
    if(this.categoriaActual === categoria){
      this.categoriaPage++;
    } else {
      this.categoriaPage = 1;
      this.categoriaActual = categoria;
    }
    // return this.http.get('http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=3765bf511747477b93e819389b94bbb6');
    return this.ejecutarQuery<RespuestaTopHeadLines>(`/top-headlines?country=us&category=${ categoria }&page=${this.categoriaPage}`);
  }


}
