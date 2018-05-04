import { InputValidationState } from '../constants/Enums';

export interface InputValidation {
  state: InputValidationState;
  message: string;
}
