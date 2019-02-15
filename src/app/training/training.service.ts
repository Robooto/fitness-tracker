import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { of, Observable, Subject } from 'rxjs';

@Injectable()
export class TraningService {
    availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    private runningExercise: Exercise;
    private exercises: Exercise[] = [];
    exerciseChanged = new Subject<Exercise>();

    constructor() {}

    getAvailableExercises(): Observable<Exercise[]> {
        return of(this.availableExercises);
    }

    startExercise(selectedId: string) {
        const selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.runningExercise = selectedExercise;
        this.exerciseChanged.next({...this.runningExercise});
    }

    completeExercise() {
        this.exercises.push({...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExercise, 
            date: new Date(), 
            state: 'cancelled',
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.duration * (progress / 100),
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise(): Observable<Exercise> {
        return of({...this.runningExercise})
    }
}