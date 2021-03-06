import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { of, Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, catchError } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TraningService {
    availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    exerciseChanged = new Subject<Exercise>();

    constructor(private db: AngularFirestore, private uiService: UIService) {}

    fetchAvailableExercises(): Observable<Exercise[]> {
        this.uiService.loadingStateChanged.next(true);
        return this.db.collection('availableExercises').snapshotChanges().pipe(
            map(res => res.map(doc => {
              return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
              } as Exercise
            })),
            tap(exercises => {
                this.availableExercises = exercises;
                this.uiService.loadingStateChanged.next(false);
            }),
            catchError(error => {
                this.uiService.showSnackbar('Fetching exercises problem!', null, 3000);
                return of([]);
            })
        );
    }

    startExercise(selectedId: string) {
        this.db.doc(`availableExercises/${selectedId}`).update({
            lastSelected: new Date()
        });
        const selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.runningExercise = selectedExercise;
        this.exerciseChanged.next({...this.runningExercise});
    }

    completeExercise() {
        this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise, 
            date: new Date(), 
            state: 'cancelled',
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise(): Observable<Exercise> {
        return of({...this.runningExercise})
    }

    getCompletedOrCancelledExercises(): Observable<Exercise[]> {
        return this.db.collection<Exercise>('finishedExercises').valueChanges();
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}