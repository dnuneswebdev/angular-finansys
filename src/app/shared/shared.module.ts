import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';

@NgModule({
  declarations: [BreadCrumbComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    //shared modules
    CommonModule,
    RouterModule, //necessario para o breadcrumb
    ReactiveFormsModule,

    //shared component
    BreadCrumbComponent //precisa declarar aqui para a aplicação ter acesso ao component
  ]
})
export class SharedModule { }
