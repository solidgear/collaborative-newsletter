/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { LayoutComponent } from '../layout/layout.component';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "../shared/authentication/auth.guard";

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'news', loadChildren: './news/news.module#NewsModule' }
        ],
        canActivate: [AuthGuard]
    },

    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent },

    // Not found
    { path: '**', redirectTo: 'home' }

];
