import {Stonk} from './stonk.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {StonkService} from './stonk.service';
import {StartListenForStonks, StopListenForStonks, UpdateStonk} from './stonk-actions';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface StonkStateModel{
  stonks: Stonk[];
}

@State<StonkStateModel>({
  name: 'stonk',
  defaults: {
    stonks: []
  }
})

@Injectable()
export class StonkState{
  unsubscribe$ = new Subject();

  constructor(private stonkService: StonkService) {}

  @Selector()
  static stonks(state: StonkStateModel): Stonk[] {
    return state.stonks;
  }

  @Action(StartListenForStonks)
  getStonks(ctx: StateContext<StonkStateModel>): void {
    this.stonkService.listenForStonks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(stonks => {
        ctx.dispatch(new UpdateStonk(stonks));
      });
  }

  @Action(StopListenForStonks)
  StopListiningForStonks(ctx: StateContext<StonkStateModel>): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @Action(UpdateStonk)
  updateStonk(ctx: StateContext<StonkStateModel>, action: UpdateStonk): void{
    const state = ctx.getState();
    const newState: StonkStateModel = {
      ...state, stonks: action.stonks
    };
    ctx.setState(newState);
  }
}
