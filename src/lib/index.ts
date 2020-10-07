import {
  ServerModule,
  DisabledRoutes,
  Middlewares,
  RouteMiddlewares,
} from '@sheetbase/server';

import {Options} from './types/storage.type';

import {OptionService} from './services/option.service';
import {HelperService} from './services/helper.service';
import {StorageService} from './services/storage.service';

import {StorageRoute} from './routes/storage.route';

export class Lib {
  optionService: OptionService;
  helperService: HelperService;
  storageService: StorageService;
  storageRoute: StorageRoute;

  constructor(private serverModule: ServerModule, options: Options) {
    // services
    this.optionService = new OptionService(options);
    this.helperService = new HelperService();
    this.storageService = new StorageService(
      this.optionService,
      this.helperService
    );
    // routes
    this.storageRoute = new StorageRoute(this.storageService);
  }

  /**
   * Expose the module routes
   */
  registerRoutes(
    routeEnabling?: true | DisabledRoutes,
    middlewares?: Middlewares | RouteMiddlewares
  ) {
    return this.serverModule.routerService.register(
      [this.storageRoute],
      routeEnabling,
      middlewares
    );
  }
}
