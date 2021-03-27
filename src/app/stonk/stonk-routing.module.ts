import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StonkComponent } from './stonk.component';

const routes: Routes = [{ path: '', component: StonkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StonkRoutingModule { }
