import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  weightsForm: FormGroup;
  savedMessage: string = '';

  defaultWeights = {
    incomeHighBonus: 100,
    incomeMedBonus: 50,
    incomeLowPenalty: 50,
    // Employment type bonuses/penalties
    contractBonus: 50,
    b2bBonus: 40,
    civilContractBonus: 20,
    pensionBonus: 30,
    unemployedPenalty: 100,
    otherEmploymentBonus: 0,
    // Education bonuses
    higherEducationBonus: 50,
    secondaryEducationBonus: 30,
    vocationalEducationBonus: 15,
    primaryEducationBonus: 0,
    // Credit history
    onTimeMultiplier: 10,
    delayMultiplier: 20,
    ageBonus: 30,
    historyLengthBonus: 2,
    inquiryPenalty: 15,
    minSubsistencePerPerson: 800
  };

  constructor(private fb: FormBuilder, public router: Router) {
    this.weightsForm = this.fb.group({
      incomeHighBonus: [0],
      incomeMedBonus: [0],
      incomeLowPenalty: [0],
      // Employment
      contractBonus: [0],
      b2bBonus: [0],
      civilContractBonus: [0],
      pensionBonus: [0],
      unemployedPenalty: [0],
      otherEmploymentBonus: [0],
      // Education
      higherEducationBonus: [0],
      secondaryEducationBonus: [0],
      vocationalEducationBonus: [0],
      primaryEducationBonus: [0],
      // Credit history
      onTimeMultiplier: [0],
      delayMultiplier: [0],
      ageBonus: [0],
      historyLengthBonus: [0],
      inquiryPenalty: [0],
      minSubsistencePerPerson: [0]
    });
  }

  ngOnInit() {
    const storedWeights = localStorage.getItem('scoreWeights');
    if (storedWeights) {
      this.weightsForm.setValue(JSON.parse(storedWeights));
    } else {
      this.weightsForm.setValue(this.defaultWeights);
    }
  }

  save() {
    localStorage.setItem('scoreWeights', JSON.stringify(this.weightsForm.value));
    this.savedMessage = 'Ustawienia zostały zapisane!';
    setTimeout(() => this.savedMessage = '', 3000);
  }

  resetDefaults() {
    this.weightsForm.setValue(this.defaultWeights);
  }
}
