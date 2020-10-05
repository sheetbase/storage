import {ServerModule, DisabledRoutes} from '@sheetbase/server';

import {Options} from './types/storage.type';

import {OptionService} from './services/option.service';
import {HelperService} from './services/helper.service';
import {SecurityService} from './services/security.service';
import {StorageService} from './services/storage.service';

import {StorageMiddleware} from './middlewares/storage.middleware';

import {StorageRoute} from './routes/storage.route';

export class Lib {
  optionService: OptionService;
  helperService: HelperService;
  securityService: SecurityService;
  storageService: StorageService;
  storageMiddleware: StorageMiddleware;
  storageRoute: StorageRoute;

  constructor(private serverModule: ServerModule, options: Options) {
    // services
    this.optionService = new OptionService(options);
    this.helperService = new HelperService();
    this.securityService = new SecurityService();
    this.storageService = new StorageService(
      this.optionService,
      this.helperService,
      this.securityService
    );
    // middlewares
    this.storageMiddleware = new StorageMiddleware(this.securityService);
    // routes
    this.storageRoute = new StorageRoute(this.storageService);
  }

  /**
   * Expose the module routes
   */
  registerRoutes(routeEnabling?: true | DisabledRoutes) {
    return this.serverModule.routerService.register(
      [this.storageRoute],
      routeEnabling,
      [this.storageMiddleware.use()]
    );
  }
}
