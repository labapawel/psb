import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent implements OnInit {
  score: number | null = null;
  scoreData: any = null;
  hasCapacity: boolean = true;
  failureMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    const storedResult = localStorage.getItem('creditScoreResult');
    if (storedResult) {
      const result = JSON.parse(storedResult);
      this.score = result.score;
      this.scoreData = result.data;
      this.hasCapacity = result.hasCapacity !== false; // Default to true if not set
      this.failureMessage = result.failureMessage || '';
    } else {
      // Redirect back to calculator if no score found
      this.router.navigate(['/calc']);
    }
  }

  get scoreColor(): string {
    if (!this.score) return '#ccc';
    if (this.score >= 700) return '#28a745'; // Green
    if (this.score >= 600) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  }

  get scoreDescription(): string {
    if (!this.score) return 'Brak danych';
    if (this.score >= 750) return 'Doskonała';
    if (this.score >= 700) return 'Bardzo dobra';
    if (this.score >= 600) return 'Dobra';
    if (this.score >= 500) return 'Przeciętna';
    return 'Niska';
  }

  getFactorStatus(factor: string): 'good' | 'average' | 'poor' {
    if (!this.scoreData) return 'average';

    switch (factor) {
      case 'history':
        // Good if 0 delays, Average if < 2, Poor if >= 2
        const delays = this.scoreData.creditHistory.paidWithDelay;
        if (delays === 0) return 'good';
        if (delays < 2) return 'average';
        return 'poor';

      case 'debt':
        // DTI ratio: Good < 30%, Average < 50%, Poor > 50%
        const income = this.scoreData.financialInfo.income;
        const expenses = this.scoreData.financialInfo.expenses;
        if (!income) return 'poor';
        const dti = expenses / income;
        if (dti < 0.3) return 'good';
        if (dti < 0.5) return 'average';
        return 'poor';

      case 'age':
        // Age: Good > 30, Average > 25, Poor < 25
        const dob = new Date(this.scoreData.personalInfo.dob);
        const age = new Date().getFullYear() - dob.getFullYear();
        if (age > 30) return 'good';
        if (age > 25) return 'average';
        return 'poor';

      case 'newCredits':
        // Mock logic: assume good for now as we don't track queries
        return 'good';

      case 'mix':
        // Employment type proxy: Contract/B2B = Good, Civil = Average, Unemployed = Poor
        const emp = this.scoreData.financialInfo.employmentType;
        if (['contract_employment', 'b2b'].includes(emp)) return 'good';
        if (['civil_contract', 'pension'].includes(emp)) return 'average';
        return 'poor';

      default:
        return 'average';
    }
  }
}
