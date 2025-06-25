import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const LoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLogin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }
  return true; // allow access if NOT logged in
};
