import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: './pages/categories/categories.module#CategoriesModule'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

//dominio.com/categories => list (master)
//dominio.com/categories/11 => form (detail)
