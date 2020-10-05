import {RouteRequest} from '@sheetbase/server';

import {AuthData} from '../types/storage.type';

export class SecurityService {
  private req: RouteRequest | undefined;
  private auth: AuthData | undefined;

  constructor() {}

  setRouting(request: RouteRequest) {
    this.req = request;
    this.auth = request.data.auth as AuthData;
  }

  isAuth() {
    return !!this.auth;
  }

  getAuth() {
    return this.auth;
  }

  getRequest() {
    return this.req;
  }
}
