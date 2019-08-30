import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { ServerErrrorMessagesComponent } from './components/server-errror-messages/server-errror-messages.component';

@NgModule({
  declarations: [BreadCrumbComponent, PageHeaderComponent, FormFieldErrorComponent, ServerErrrorMessagesComponent],
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
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrrorMessagesComponent
  ]
})
export class SharedModule { }
