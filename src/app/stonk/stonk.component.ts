import { Component, OnInit, OnDestroy } from '@angular/core';
import {StonkService} from './shared/stonk.service';
import {Observable, Subject} from 'rxjs';
import {Stonk} from './shared/stonk.model';
import {takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-stonk',
  templateUrl: './stonk.component.html',
  styleUrls: ['./stonk.component.scss']
})
export class StonkComponent implements OnInit, OnDestroy {

  error: string | undefined;
  stonks: Stonk[] = [];
  unsubscribe$ = new Subject();
  selectedStonk: Stonk | undefined;
  stonkVariableFC = new FormControl('');
  stonkInputFC = new FormControl('');

  constructor(private stonkService: StonkService) { }

  ngOnInit(): void {
    this.stonkService.listenForErrors()
      .pipe(takeUntil(this.unsubscribe$)
      )
      .subscribe(error => {
        this.error = error;
      });

    this.stonkService.listenForStonks()
      .pipe(takeUntil(this.unsubscribe$)
      )
      .subscribe( stonk => {
        this.stonks = stonk;
      });

    this.stonkService.listenForStonkUpdate()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe( stonk => {
        const index = this.stonks.findIndex((s) => s.name === stonk.name);
        this.stonks[index] = stonk;
      });
  }

  ngOnDestroy(): void {
    console.log('Destroyed stonks');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectStonk(stonk: Stonk): void {
    this.selectedStonk = stonk;
  }

  updateStonk(): void {
    if (this.stonkVariableFC.value){
      switch (this.stonkVariableFC.value) {
        case 'price': {
          if (this.stonkInputFC.value)
          {
            if (Number.parseFloat(this.stonkInputFC.value))
            {
              if (this.selectedStonk)
              {
                this.selectedStonk.price = this.stonkInputFC.value;
                this.stonkService.sendUpdate(this.selectedStonk);
              } else{
                this.error = 'I dont know what the fuck you did';
              }
            }else {
              this.error = 'this is not a number';
            }
          } else{
            this.error = 'No updaterble input';
          }
          break;
        }
        case 'description': {
          if (this.stonkInputFC.value)
          {
              if (this.selectedStonk)
              {
                this.selectedStonk.description = this.stonkInputFC.value;
                this.stonkService.sendUpdate(this.selectedStonk);
              } else{
                this.error = 'I dont know what the fuck you did';
              }
          } else{
            this.error = 'No updaterble input';
          }
          break;
        }

      }
    }

  }
}
