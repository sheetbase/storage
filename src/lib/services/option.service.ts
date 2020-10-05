import {Options, Extendable} from '../types/storage.type';

export class OptionService {
  private options: Options;

  constructor(options: Options) {
    this.options = {
      maxSize: 10,
      urlBuilder: ['https://drive.google.com/uc?id='],
      ...options,
    };
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: Options | Extendable) {
    return (this.options = {...this.options, ...options});
  }
}
