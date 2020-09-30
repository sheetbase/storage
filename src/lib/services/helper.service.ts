import {md5} from '../../md5/md5';

export class HelperService {
  constructor() {}

  md5(str: string, key?: string | undefined, raw?: boolean) {
    return md5(str, key, raw);
  }
}
