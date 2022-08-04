import { IDropdownOption } from '@fluentui/react/lib/Dropdown';

export interface IAsyncDropdownProps {
  label: string;
  loadOptions: () => Promise<IDropdownOption[]>;
  onChanged: (option: IDropdownOption<any>, index?: number) => void;
  selectedKey: string | number;
  disabled: boolean;
  stateKey: string;
}