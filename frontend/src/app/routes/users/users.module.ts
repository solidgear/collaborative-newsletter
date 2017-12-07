/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { SharedModule } from '../../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { AuthGuard } from '../../shared/authentication/auth.guard';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  { path: ':id/resetPassword', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    Ng2TableModule,
    SharedModule,
    FileUploadModule
  ],
  declarations: [UserFormComponent],
  exports: [
    RouterModule
  ]
})

export class UsersModule { }
