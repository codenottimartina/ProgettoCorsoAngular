import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router";

export interface AuthResponseData{
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCxOASktcvUU0AKfXQL4T1SSzHyvpkh4ho',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            
        }));
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCxOASktcvUU0AKfXQL4T1SSzHyvpkh4ho',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn
                );
            }));
    }

    autoLogin(){
        const userData: {
            email: string, 
            id: string, 
            _token: string, 
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData')); 
        // ottiene dei dati dalla memoria locale e li trasforma da json ad oggetto js
        if(!userData){ 
            return;
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.clear(); // elimina tutti i dati memorizzati in memoria locale

        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(
                new Date().getTime() + expiresIn * 1000
            ); // expiresIn è in secondi quindi va moltiplicato per mille per trasformarlo in millisecondi
        const user = new User(
            email, 
            userId, 
            token,
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000); 
        localStorage.setItem('userData', JSON.stringify(user));
        // permette di salvare dei dati in memoria locale sotto forma di stringa (trasforma i dati prima in json poi in stringa)
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = null;
        if(!errorRes.error || !errorRes.error.error){
            return throwError('Errore sconosciuto!');
        }

        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'Esiste già un account con questa email';
                break; 
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'l\'accesso tramite password è disabilitato per questo progetto.';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'abbiamo bloccato tutte le richieste provenienti da questo dispositivo a causa di attività insolite. Riprovare più tardi.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email non trovata!';
                break; 
            case 'INVALID_PASSWORD':
                errorMessage = 'Password non valida!';
                break;
            case 'USER_DISABLED':
                errorMessage = 'Utente disabilitato';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Credenziali non valide';
                break;
            default: 
                errorMessage = errorRes.error.error.message;
                break;
        }
        return throwError(errorMessage);
    }
}