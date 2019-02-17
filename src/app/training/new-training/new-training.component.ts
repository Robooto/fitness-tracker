import { Component, OnInit } from '@angular/core';
import { TraningService } from '../training.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  excersize$: Observable<any>;
  
  constructor(private trainingService: TraningService) { }

  ngOnInit() {
    this.excersize$ = this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
