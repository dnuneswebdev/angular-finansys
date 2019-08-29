import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';

@NgModule({
  declarations: [BreadCrumbComponent, PageHeaderComponent],
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
    BreadCrumbComponent, //precisa declarar aqui para a aplicação ter acesso ao component
    PageHeaderComponent
  ]
})
export class SharedModule { }
