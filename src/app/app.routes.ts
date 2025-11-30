import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { CalcComponent } from './calc/calc.component';
import { ScoreComponent } from './score/score.component';
import { StartComponent } from './start/start.component';

export const routes: Routes = [
    {
        path: '',
        component: StartComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'calc',
        component: CalcComponent
    },
    {
        path: 'score',
        component: ScoreComponent
    }
];