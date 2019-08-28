import { OnInit, AfterContentChecked, Injector } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import toastr from 'toastr'

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string
  resourceForm: FormGroup
  pageTitle: string
  serverErrorMessages: string[] = null
  submitedForm: boolean = false

  protected route: ActivatedRoute
  protected router: Router
  protected formBuilder: FormBuilder

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
    this.route = this.injector.get(ActivatedRoute)
    this.router = this.injector.get(Router)
    this.formBuilder = this.injector.get(FormBuilder)
  }

  ngOnInit() {
    this.setCurrentAction()
    this.buildResourceForm()
    this.loadResource()
  }

  ngAfterContentChecked() {
    //carrega só após tudo da pagina ser carregado
    this.setPageTitle()
  }

  submitForm() {
    this.submitedForm = true

    if (this.currentAction == 'new') {
      this.createResource()
    } else {
      this.updateResource()
    }
  }

  //PRIVATE METHODS

  protected setCurrentAction() {

    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  protected loadResource() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap(params => this.resourceService.getById(+params.get('id')))
        )
        .subscribe(
          resource => {
            this.resource = resource
            this.resourceForm.patchValue(resource)
          },
          error => alert('Ocorreu um erro no servidor, tenta mais tarde')
        )
    }
  }

  protected setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle()
    } else {
      this.pageTitle = this.editionPageTitle()
    }
  }

  protected creationPageTitle(): string {
    return 'Novo'
  }

  protected editionPageTitle(): string {
    return 'Edição'
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    this.resourceService.create(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    )
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    this.resourceService.update(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    )
  }

  protected actionsForSuccess(resource: T) {
    toastr.success('Soilitação processada com sucesso!')

    const baseComponentPath: string = this.route.snapshot.params.url[0].path

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() => this.router.navigate([baseComponentPath, resource.id, 'edit']))
  }

  protected actionsForError(error) {
    toastr.error('Ocorrou um erro ao processar sua solicitação...')

    this.submitedForm = false

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors
    } else {
      this.serverErrorMessages = [
        'Falha na comunicação com o servidor, por favor tente mais tarde...'
      ]
    }
  }

  protected abstract buildResourceForm(): void

}
