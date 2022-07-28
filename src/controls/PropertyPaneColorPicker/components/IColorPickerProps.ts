
export interface IColorPickerProps {
  label: string;
  onChanged: (color?: string) => void;
  selectedKey: string | number;
  disabled: boolean;
  stateKey: string;
}