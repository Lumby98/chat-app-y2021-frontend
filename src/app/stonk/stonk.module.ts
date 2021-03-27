import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StonkRoutingModule } from './stonk-routing.module';
import { StonkComponent } from './stonk.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '../shared/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';


@NgModule({
  declarations: [StonkComponent],
  imports: [
    CommonModule,
    StonkRoutingModule,
    MatButtonModule,
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule
  ]
})
export class StonkModule { }
