import { NgModule } from '@angular/core';
import { AuthModule } from '../auth.module';

import { VerifyCodePageRoutingModule } from './verify-code-routing.module';

import { VerifyCodePage } from './verify-code.page';

import { NgxOtpInputComponent } from 'ngx-otp-input';


@NgModule({
  imports: [
    AuthModule,
    VerifyCodePageRoutingModule,
    NgxOtpInputComponent,
    
  ],
  declarations: [VerifyCodePage,]
})
export class VerifyCodePageModule {}
