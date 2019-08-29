import { BaseResourceModel } from '../models/base-resource.model';

import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> { //recebe como parametro o tipo

  protected http: HttpClient //precisa dessa instancia do http

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T) {

    this.http = injector.get(HttpClient)//avisa pro angular que todas as classes que vão herdar da base, ja passem a dependenpcia HTTP

  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      map(this.jsonDataToResources.bind(this)),//passa o THIS da classe, se não passar, ele fica com o this do map e não carrega as coisas
      catchError(this.handleError)
    )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`

    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`

    return this.http.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`

    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

  //PROTECTED METHODS

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData)
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = []

    jsonData.forEach(element => {
      resources.push(this.jsonDataToResourceFn(element))
    })
    return resources
  }

  protected handleError(error: any): Observable<any> {
    console.log('Erro na requisição=> ', error)
    return throwError(error)
  }
}