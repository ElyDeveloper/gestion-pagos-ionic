import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    let token = null;

    //verificar si la llave tokensession existe en el local storage
    if (localStorage.getItem('tokensession')) {
        token = localStorage.getItem('tokensession');
    }

    // console.log('Token de sesión: ', token)


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