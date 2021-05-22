"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var ionic_angular_2 = require('ionic-angular');
var AuthService_1 = require('../../../services/AuthService/AuthService');
var PasswordResetModal = (function () {
    function PasswordResetModal(params, viewCtrl, authService) {
        this.viewCtrl = viewCtrl;
        this.authService = authService;
        this.showSubmitResetPasswordForm = false;
        this.passwordResetData = {
            email: '',
            password: '',
            token: ''
        };
    }
    PasswordResetModal.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    PasswordResetModal.prototype.togglePasswordResetForms = function () {
        this.showSubmitResetPasswordForm = !this.showSubmitResetPasswordForm;
    };
    PasswordResetModal.prototype.requestNewPasswordWithToken = function (form) {
        console.log("requestNewPasswordWithToken");
        if (form.form._status == "VALID") {
            this.authService.requestNewPasswordWithToken(form.value.newPasswordWithToken)
                .then(function (success) {
                console.log(success);
            })
                .catch(function (err) {
                console.log(err);
            });
        }
        else {
            console.log("Form is invalid");
        }
    };
    PasswordResetModal.prototype.submitPasswordResetForm = function (form) {
        console.log("submitPasswordResetForm");
        console.log(form.form);
        if (form.form._status == "VALID") {
            this.authService.requestPasswordReset(form.value.passwordResetData)
                .then(function (success) {
                console.log(success);
            })
                .catch(function (err) {
                console.log(err);
            });
        }
        else {
            console.log("Form is invalid");
        }
    };
    PasswordResetModal = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/Login/PasswordResetModal/PasswordResetModal.component.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_2.NavParams, ionic_angular_1.ViewController, AuthService_1.AuthService])
    ], PasswordResetModal);
    return PasswordResetModal;
}());
exports.PasswordResetModal = PasswordResetModal;
