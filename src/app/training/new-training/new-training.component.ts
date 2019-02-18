import { Component, OnInit } from '@angular/core';
import { TraningService } from '../training.service';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  excersize$: Observable<any>;
  isLoading$: Observable<boolean>;
  
  constructor(private trainingService: TraningService, private uiService: UIService) { }

  ngOnInit() {
    this.isLoading$ = this.uiService.loadingStateChanged.asObservable();
    this.excersize$ = this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
