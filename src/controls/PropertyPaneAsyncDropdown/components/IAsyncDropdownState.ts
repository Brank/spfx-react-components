import { IDropdownOption } from '@fluentui/react/lib/Dropdown';

export interface IAsyncDropdownState {
  loading: boolean;
  options: IDropdownOption<any>[];
  error: string;
}