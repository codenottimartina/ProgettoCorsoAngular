import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { BehaviorSubject, throwError } from "rxjs";

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

    constructor(private http: HttpClient){}

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

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
            ); // expiresIn è in millisecondi quindi va moltiplicato per mille
        const user = new User(
            email, 
            userId, 
            token,
            expirationDate
        );
        this.user.next(user);
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