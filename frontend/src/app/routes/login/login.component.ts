/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate/ng2-translate';

import {AuthService} from "../../shared/authentication/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {

  errorMessage: string;
  valForm: FormGroup;
  showError = false;
  private subscriptions = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    fb: FormBuilder
  ) {
    this.valForm = fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
    translate.setDefaultLang('en');
    this.setLanguage();
  }

  setLanguage() {
    let availableLangs = this.translate.getLangs();
    let browserLang = this.translate.getBrowserCultureLang();
    if(availableLangs.indexOf(browserLang) != -1) {
      this.translate.use(browserLang);
    }
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
        var subLogin = this.authService.login(this.valForm.value.username, this.valForm.value.password)
          .subscribe(
            result => {
              if (result.result === 200) {
                this.router.navigate(['/home'])
              }
              this.showError = false;
            },
            error =>  {
              this.errorMessage = <any>error;
              this.showError = true;
            }
          );
        this.subscriptions.push(subLogin);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    for (var subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
