import {ServerModule, DisabledRoutes} from '@sheetbase/server';

import {Options} from './types';
import {HelperService} from './services/helper.service';
import {StorageService} from './services/storage.service';
import {StorageRoute} from './routes/storage.route';

export class Lib {
  helperService: HelperService;
  storageService: StorageService;
  storageRoute: StorageRoute;

  constructor(private serverModule: ServerModule, options: Options) {
    // services
    this.helperService = new HelperService();
    this.storageService = new StorageService(this.helperService, options);
    // routes
    this.storageRoute = new StorageRoute(this.storageService);
  }

  /**
   * Expose the module routes
   */
  registerRoutes(routeEnabling?: true | DisabledRoutes) {
    return this.serverModule.routerService.register(
      [this.storageRoute],
      routeEnabling
    );
  }
}
