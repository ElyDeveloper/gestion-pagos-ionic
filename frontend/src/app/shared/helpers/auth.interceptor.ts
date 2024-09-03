import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const cookieService = inject(CookieService);
    const router = inject(Router);
    const token = cookieService.get('tokensession');

    if (token) {
        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(modifiedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Redirigir al usuario a la página de login
                    router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Redirigir al usuario a la página de login
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
}