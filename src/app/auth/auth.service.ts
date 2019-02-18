import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAauth: AngularFireAuth,
        private uiService: UIService
        ) {}

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAauth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
                this.authSuccessfully();
            })
            .catch(error => {
                this.uiService.showSnackbar(error.message, null, 3000);
            })
            .finally(() => this.uiService.loadingStateChanged.next(false));
        
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAauth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
            this.authSuccessfully();
        })
        .catch(error => {
            this.uiService.showSnackbar(error.message, null, 3000);
        })
        .finally(() => this.uiService.loadingStateChanged.next(false));
    }

    logout() {
        this.afAauth.auth.signOut();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    isAuth() {
        return this.isAuthenticated;
    }

    private authSuccessfully() {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}