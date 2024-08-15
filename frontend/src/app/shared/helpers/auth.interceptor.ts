import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { CookieService } from "ngx-cookie-service";


export const AuthInterceptor: HttpInterceptorFn = (req, next)=>{
    const cookieService = inject(CookieService);
    const token = cookieService.get('tokensession');

    if(token){
        const modifiedReq = req.clone({
            setHeaders:{
                Authorization: `Bearer ${token}`
            }
        });
        return next(modifiedReq);
    }
    return next(req);
}
