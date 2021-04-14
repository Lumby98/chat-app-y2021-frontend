import {Stonk} from './stonk.model';

export class StartListenForStonks {
  static readonly type = '[stonk] start listing for stonks';

}

export class StopListenForStonks {
  static readonly type = '[stonk] stop listing for stonks';
}

export class StartListenForStonkUpdate {
  static readonly type = '[stonk] start listing for stonk updates';
}

export class StopListenForStonkUpdate {
  static readonly type = '[stonk] stop listing for stonk updates';
}

export class UpdateStonk {
  static readonly type = '[stonk] update stonk';
  constructor(public stonks: Stonk[]) {
  }
}
