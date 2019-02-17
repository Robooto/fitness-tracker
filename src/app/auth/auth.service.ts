import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAauth: AngularFireAuth
        ) {}

    registerUser(authData: AuthData) {
        this.afAauth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
                this.authSuccessfully();
            })
            .catch(result => console.log(result));
        
    }

    login(authData: AuthData) {
        this.afAauth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
            this.authSuccessfully();
        })
        .catch(result => console.log(result));
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