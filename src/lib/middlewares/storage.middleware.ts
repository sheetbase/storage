import {
  RouteRequest,
  RouteResponse,
  RouteNext,
  RoutingHandler,
} from '@sheetbase/server';

import {SecurityService} from '../services/security.service';

export class StorageMiddleware {
  constructor(private securityService: SecurityService) {}

  use(): RoutingHandler {
    return (req: RouteRequest, res: RouteResponse, next: RouteNext) => {
      this.securityService.setRouting(req);
      return next();
    };
  }
}
