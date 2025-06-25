import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonHelper } from './common-helper.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let currentUser = CommonHelper.GetUser();
  if (authService.isLogin()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};

