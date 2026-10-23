import type { WizardStep } from './shared';
import { CHECK_SVG } from './shared';

interface StepBarProps {
  wizardStep: WizardStep;
}

export function StepBar({ wizardStep }: StepBarProps) {
  return (
    <div className="wizard-step-bar">
      {(['Subjects', 'Topics', 'Session'] as const).map((label, idx) => {
        const stepN = (idx + 1) as WizardStep;
        const isDone = wizardStep > stepN;
        const isActive = wizardStep === stepN;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : undefined }}>
            <div className={`wizard-step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}>
              <div className="wizard-step-num">{isDone ? CHECK_SVG : stepN}</div>
              <span className="wizard-step-label">{label}</span>
            </div>
            {idx < 2 && <div className="wizard-step-line" />}
          </div>
        );
      })}
    </div>
  );
}
