import { Component, OnInit } from '@angular/core';
import { TraningService } from '../training.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  excersize$: Observable<Exercise[]>;
  
  constructor(private trainingService: TraningService) { }

  ngOnInit() {
    this.excersize$ = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
