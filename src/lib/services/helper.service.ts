import {md5} from '../vendors/md5.vendor';

export class HelperService {
  constructor() {}

  md5(str: string, key?: string | undefined, raw?: boolean) {
    return md5(str, key, raw);
  }
}
