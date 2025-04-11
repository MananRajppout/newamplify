import { IProjectForm } from "./ProjectFormInterface";

// Local state type override: treat Date fields as strings to allow initial empty values

export type IProjectFormState = Omit<IProjectForm, "firstDateOfStreaming" | "projectDate"> & {
  firstDateOfStreaming: string;
  projectDate: string;
};

export interface StepProps {
  formData: IProjectFormState;
  updateFormData: (fields: Partial<IProjectFormState>) => void;
  uniqueId: string | null;
}


export interface Step1Props {
  // Note: We're using the state type that we defined in CreateProjectPage (date fields as strings)
  formData: Omit<IProjectFormState, "firstDateOfStreaming" | "projectDate"> & {
    firstDateOfStreaming: string;
    projectDate: string;
  };
  updateFormData: (fields: Partial<
    Omit<IProjectFormState, "firstDateOfStreaming" | "projectDate"> & {
      firstDateOfStreaming: string;
      projectDate: string;
    }
  >) => void;
}

export interface Step2Props {
  formData: IProjectFormState;
 updateFormData: (fields: Partial<IProjectFormState>) => void;
 uniqueId: string | null;
}

export type Step2FormValues = {
 respondentsPerSession: number;
 numberOfSessions: number;
 sessionLength: string;
 preWorkDetails: string;
 selectedLanguage: string;
 languageSessionBreakdown: string;
 additionalInfo: string;
 inLanguageHosting?: "yes" | "no";
 recruitmentSpecs?: string;
};

export interface Step3Props {
  formData: IProjectFormState;
  updateFormData: (fields: Partial<IProjectFormState>) => void;
  uniqueId: string | null;
}


export interface Step4Props {
  formData: {
    name: string;
    service: string;
    respondentCountry: string;
    respondentLanguage: string | string[];
    sessions: Array<{ number: number; duration: string }>;
    description?: string;
    firstDateOfStreaming: string;
  };
  updateFormData: (fields: Partial<IProjectFormState>) => void;
  uniqueId: string | null;
}

export interface PaymentIntegrationProps {
  totalPurchasePrice: number;
  totalCreditsNeeded: number;
  projectData: Partial<IProjectFormState>;
  uniqueId: string | null;
}

export interface BillingFormProps {
  onSuccess: () => void;
}

export interface CardSetupFormProps {
  onCardSaved: () => void;
}