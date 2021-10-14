import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;

    /*this gets user credentials from the AccountService.currentUser$ and assigns 
      it to local currentUser then we check to make sure there IS a user and clone
      it and add out authentication header to it.
      the take(1) lets us get data without unsubscribing from the account service.
      The entire purpose is to attach the user's security token to every request
      when we're logged in and only get the token once.
    */
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user)

    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
    }
    return next.handle(request);
  }
}
