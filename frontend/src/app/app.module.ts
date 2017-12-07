import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import {AuthService} from "./shared/authentication/auth.service";
import {AuthGuard} from "./shared/authentication/auth.guard";
import {ApiService} from "./shared/network/api.service";
import {ConfigurationService} from "./shared/configuration/configuration.service";
import {HttpService} from "./shared/network/http.service";
import {NewsService} from "./routes/news/news.service";
import {ToasterService} from "angular2-toaster/angular2-toaster";
import {UsersService} from "./routes/users/users.service";

// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

// https://github.com/angular/angular/issues/9047
export function init_app(configService: ConfigurationService){
  return () => configService.load()
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    providers: [AuthService,
                AuthGuard,
                ApiService,
                ConfigurationService,
                HttpService,
                NewsService,
                ToasterService,
                UsersService,
                {
                  'provide': APP_INITIALIZER,
                  'useFactory': init_app,
                  'deps': [ConfigurationService],
                  'multi': true,
                },
                {provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap: [AppComponent]
})
export class AppModule { }
