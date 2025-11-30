import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calc',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './calc.component.html',
  styleUrl: './calc.component.scss'
})
export class CalcComponent {
  creditForm: FormGroup;
  currentStep = 1;
  totalSteps = 5;

  constructor(private fb: FormBuilder, private router: Router) {
    this.creditForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dob: ['', Validators.required],
        education: ['', Validators.required],
        maritalStatus: ['', Validators.required],
        dependents: [0, [Validators.required, Validators.min(0)]]
      }),
      financialInfo: this.fb.group({
        income: [null, [Validators.required, Validators.min(0)]],
        expenses: [null, [Validators.required, Validators.min(0)]],
        employmentType: ['', Validators.required]
      }),
      creditInfo: this.fb.group({
        amount: [null, [Validators.required, Validators.min(1000)]],
        term: [null, [Validators.required, Validators.min(3)]],
        rate: [null, [Validators.required, Validators.min(0)]],
        type: ['', Validators.required]
      }),
      creditHistory: this.fb.group({
        historyLength: [0, [Validators.required, Validators.min(0)]],
        paidOnTime: [0, [Validators.required, Validators.min(0)]],
        paidWithDelay: [0, [Validators.required, Validators.min(0)]],
        creditInquiries: [0, [Validators.required, Validators.min(0)]]
      })
    });
  }

  nextStep() {
    let currentGroup: FormGroup | null = null;

    if (this.currentStep === 1) currentGroup = this.creditForm.get('personalInfo') as FormGroup;
    else if (this.currentStep === 2) currentGroup = this.creditForm.get('financialInfo') as FormGroup;
    else if (this.currentStep === 3) currentGroup = this.creditForm.get('creditInfo') as FormGroup;
    else if (this.currentStep === 4) currentGroup = this.creditForm.get('creditHistory') as FormGroup;

    if (currentGroup && currentGroup.invalid) {
      currentGroup.markAllAsTouched();
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit() {
    console.log('Submit called');
    if (this.creditForm.valid) {
      console.log('Form is valid', this.creditForm.value);
      const formData = this.creditForm.value;

      // Check creditworthiness first
      const creditworthinessCheck = this.checkCreditworthiness(formData);
      if (!creditworthinessCheck.hasCapacity) {
        // Save failure information and navigate to score page
        const result = {
          score: null,
          hasCapacity: false,
          failureMessage: creditworthinessCheck.message,
          data: formData,
          date: new Date().toISOString()
        };
        localStorage.setItem('creditScoreResult', JSON.stringify(result));
        this.router.navigate(['/score']);
        return;
      }

      const score = this.calculateScore(formData);
      console.log('Calculated score:', score);

      const result = {
        score: score,
        hasCapacity: true,
        data: formData,
        date: new Date().toISOString()
      };

      localStorage.setItem('creditScoreResult', JSON.stringify(result));
      console.log('Saved to localStorage, navigating...');
      this.router.navigate(['/score']);
    } else {
      console.log('Form is invalid');
      this.creditForm.markAllAsTouched();
    }
  }

  private calculateMonthlyInstallment(amount: number, term: number, annualRate: number): number {
    if (annualRate === 0) {
      return amount / term;
    }
    const monthlyRate = annualRate / 100 / 12;
    return amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  }

  private checkCreditworthiness(data: any): { hasCapacity: boolean, message: string } {
    console.log('\n=== SPRAWDZANIE ZDOLNOŚCI KREDYTOWEJ ===');

    const income = data.financialInfo.income;
    const expenses = data.financialInfo.expenses;
    const dependents = data.personalInfo.dependents;
    const loanAmount = data.creditInfo.amount;
    const loanTerm = data.creditInfo.term;
    const annualRate = data.creditInfo.rate;

    // Load weights for subsistence minimum
    const storedWeights = localStorage.getItem('scoreWeights');
    const defaultWeights = {
      minSubsistencePerPerson: 800
    };
    const weights = storedWeights
      ? { ...defaultWeights, ...JSON.parse(storedWeights) }
      : defaultWeights;

    // Calculate monthly installment
    const monthlyInstallment = this.calculateMonthlyInstallment(loanAmount, loanTerm, annualRate);

    // Calculate subsistence minimum for family
    const familySize = 1 + dependents; // applicant + dependents
    const totalSubsistence = weights.minSubsistencePerPerson * familySize;

    // Calculate disposable income
    const disposableIncome = income - expenses - monthlyInstallment - totalSubsistence;

    console.log(`Dochód miesięczny: ${income} PLN`);
    console.log(`Zobowiązania (wydatki): ${expenses} PLN`);
    console.log(`Rata kredytu: ${monthlyInstallment.toFixed(2)} PLN`);
    console.log(`Minimum egzystencji (${familySize} os. × ${weights.minSubsistencePerPerson} PLN): ${totalSubsistence} PLN`);
    console.log(`Dochód rozporządzalny: ${disposableIncome.toFixed(2)} PLN`);

    if (disposableIncome < 0) {
      const message = `Dochód: ${income} PLN\n` +
        `Zobowiązania: ${expenses} PLN\n` +
        `Rata kredytu: ${monthlyInstallment.toFixed(2)} PLN\n` +
        `Minimum egzystencji (${familySize} osób): ${totalSubsistence} PLN\n` +
        `\nDochód rozporządzalny: ${disposableIncome.toFixed(2)} PLN\n` +
        `\nBrakuje: ${Math.abs(disposableIncome).toFixed(2)} PLN`;

      console.log('✗ BRAK ZDOLNOŚCI KREDYTOWEJ');
      console.log('=====================================\n');
      return { hasCapacity: false, message };
    }

    console.log('✓ ZDOLNOŚĆ KREDYTOWA POTWIERDZONA');
    console.log('=====================================\n');
    return { hasCapacity: true, message: '' };
  }

  private calculateScore(data: any): number {
    console.log('=== ROZPOCZĘcie OBLICZEŃ SCORE ===');
    console.log('Dane wejściowe:', data);

    let score = 400; // Base score
    console.log('1. Score bazowy:', score);

    // Load weights
    const storedWeights = localStorage.getItem('scoreWeights');
    const defaultWeights = {
      incomeHighBonus: 100,
      incomeMedBonus: 50,
      incomeLowPenalty: 50,
      // Employment
      contractBonus: 50,
      b2bBonus: 40,
      civilContractBonus: 20,
      pensionBonus: 30,
      unemployedPenalty: 100,
      otherEmploymentBonus: 0,
      // Education
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

    // Merge stored weights with defaults to handle missing fields
    const weights = storedWeights
      ? { ...defaultWeights, ...JSON.parse(storedWeights) }
      : defaultWeights;
    console.log('2. Wagi:', weights);

    // 1. Income vs Expenses (DTI)
    const income = data.financialInfo.income;
    const expenses = data.financialInfo.expenses;
    const disposableIncome = income - expenses;
    console.log(`3. Dochód: ${income} PLN, Wydatki: ${expenses} PLN, Dochód rozporządzalny: ${disposableIncome} PLN`);

    let incomeAdjustment = 0;
    if (disposableIncome > 2000) {
      incomeAdjustment = weights.incomeHighBonus;
      console.log(`   ✓ Wysoki dochód rozporządzalny (>2000): +${incomeAdjustment}`);
    } else if (disposableIncome > 1000) {
      incomeAdjustment = weights.incomeMedBonus;
      console.log(`   ✓ Średni dochód rozporządzalny (>1000): +${incomeAdjustment}`);
    } else if (disposableIncome < 500) {
      incomeAdjustment = -weights.incomeLowPenalty;
      console.log(`   ✗ Niski dochód rozporządzalny (<500): ${incomeAdjustment}`);
    } else {
      console.log(`   ○ Dochód rozporządzalny w przedziale 500-1000: brak zmiany`);
    }
    score += incomeAdjustment;
    console.log(`   Score po dochodzie: ${score}`);


    // 2. Employment
    const empType = data.financialInfo.employmentType;
    console.log(`4. Forma zatrudnienia: ${empType}`);

    let employmentAdjustment = 0;
    if (empType === 'contract_employment') {
      employmentAdjustment = weights.contractBonus;
      console.log(`   ✓ Umowa o pracę: +${employmentAdjustment}`);
    } else if (empType === 'b2b') {
      employmentAdjustment = weights.b2bBonus;
      console.log(`   ✓ B2B/Działalność gospodarcza: +${employmentAdjustment}`);
    } else if (empType === 'civil_contract') {
      employmentAdjustment = weights.civilContractBonus;
      console.log(`   ✓ Umowa cywilnoprawna: +${employmentAdjustment}`);
    } else if (empType === 'pension') {
      employmentAdjustment = weights.pensionBonus;
      console.log(`   ✓ Emerytura/Renta: +${employmentAdjustment}`);
    } else if (empType === 'unemployed') {
      employmentAdjustment = -weights.unemployedPenalty;
      console.log(`   ✗ Brak zatrudnienia: ${employmentAdjustment}`);
    } else if (empType === 'other') {
      employmentAdjustment = weights.otherEmploymentBonus;
      console.log(`   → Inne zatrudnienie: ${employmentAdjustment > 0 ? '+' : ''}${employmentAdjustment}`);
    } else {
      console.log(`   ○ Nieznana forma zatrudnienia: brak zmiany`);
    }
    score += employmentAdjustment;
    console.log(`   Score po zatrudnieniu: ${score}`);

    // 2.5. Education
    const education = data.personalInfo.education;
    console.log(`4.5. Wykształcenie: ${education}`);

    let educationAdjustment = 0;
    if (education === 'higher') {
      educationAdjustment = weights.higherEducationBonus;
      console.log(`   ✓ Wyższe: +${educationAdjustment}`);
    } else if (education === 'secondary') {
      educationAdjustment = weights.secondaryEducationBonus;
      console.log(`   ✓ Średnie: +${educationAdjustment}`);
    } else if (education === 'vocational') {
      educationAdjustment = weights.vocationalEducationBonus;
      console.log(`   ✓ Zawodowe: +${educationAdjustment}`);
    } else if (education === 'primary') {
      educationAdjustment = weights.primaryEducationBonus;
      console.log(`   → Podstawowe: ${educationAdjustment > 0 ? '+' : ''}${educationAdjustment}`);
    } else {
      console.log(`   ○ Nieznane wykształcenie: brak zmiany`);
    }
    score += educationAdjustment;
    console.log(`   Score po wykształceniu: ${score}`);

    // 3. Credit History
    const historyLength = data.creditHistory.historyLength;
    const paidOnTime = data.creditHistory.paidOnTime;
    const paidWithDelay = data.creditHistory.paidWithDelay;
    const creditInquiries = data.creditHistory.creditInquiries;
    console.log(`5. Historia kredytowa:`);
    console.log(`   - Długość historii: ${historyLength} miesięcy`);
    console.log(`   - Terminowe spłaty: ${paidOnTime}`);
    console.log(`   - Opóźnione spłaty: ${paidWithDelay}`);
    console.log(`   - Zapytania kredytowe (12 mies.): ${creditInquiries}`);

    // Credit history length bonus
    const historyBonus = Math.min(historyLength * weights.historyLengthBonus, 100); // Cap at 100
    console.log(`   ✓ Bonus za długość historii: +${historyBonus} (${historyLength} × ${weights.historyLengthBonus}, max 100)`);

    const onTimeBonus = paidOnTime * weights.onTimeMultiplier;
    const delayPenalty = paidWithDelay * weights.delayMultiplier;
    const inquiryPenaltyAmount = creditInquiries * weights.inquiryPenalty;

    console.log(`   ✓ Bonus za terminowe spłaty: +${onTimeBonus} (${paidOnTime} × ${weights.onTimeMultiplier})`);
    console.log(`   ✗ Kara za opóźnienia: -${delayPenalty} (${paidWithDelay} × ${weights.delayMultiplier})`);
    console.log(`   ✗ Kara za zapytania kredytowe: -${inquiryPenaltyAmount} (${creditInquiries} × ${weights.inquiryPenalty})`);

    score += historyBonus;
    score += onTimeBonus;
    score -= delayPenalty;
    score -= inquiryPenaltyAmount;
    console.log(`   Score po historii kredytowej: ${score}`);

    // 4. Age
    const dob = new Date(data.personalInfo.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    console.log(`6. Wiek: ${age} lat (data urodzenia: ${data.personalInfo.dob})`);

    let ageAdjustment = 0;
    if (age > 25 && age < 60) {
      ageAdjustment = weights.ageBonus;
      console.log(`   ✓ Wiek w optymalnym przedziale (25-60): +${ageAdjustment}`);
    } else {
      console.log(`   ○ Wiek poza optymalnym przedziałem: brak zmiany`);
    }
    score += ageAdjustment;
    console.log(`   Score po wieku: ${score}`);

    // Cap score
    const finalScore = Math.max(0, Math.min(850, score));
    console.log(`7. Score przed ograniczeniem: ${score}`);
    console.log(`8. Score końcowy (ograniczony do 0-850): ${finalScore}`);

    console.log('\n=== PODSUMOWANIE ===');
    console.log(`Score bazowy: ${400}`);
    console.log(`Korekta dochodu: ${incomeAdjustment > 0 ? '+' : ''}${incomeAdjustment}`);
    console.log(`Korekta zatrudnienia: ${employmentAdjustment > 0 ? '+' : ''}${employmentAdjustment}`);
    console.log(`Korekta wykształcenia: ${educationAdjustment > 0 ? '+' : ''}${educationAdjustment}`);
    console.log(`Korekta długość historii: +${historyBonus}`);
    console.log(`Korekta terminowe spłaty: +${onTimeBonus}`);
    console.log(`Korekta opóźnienia: -${delayPenalty}`);
    console.log(`Korekta zapytania kredytowe: -${inquiryPenaltyAmount}`);
    console.log(`Korekta wiek: ${ageAdjustment > 0 ? '+' : ''}${ageAdjustment}`);
    console.log(`SCORE KOŃCOWY: ${finalScore}`);
    console.log('===================\n');

    return finalScore;
  }
}
