import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Injectable()
export class OnlyLoggedInGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
      if (this.authService.isAuthenticated()) {
          return true;
      } else {
          this.router.navigateByUrl('/login');
          return false;
      }
    }
}