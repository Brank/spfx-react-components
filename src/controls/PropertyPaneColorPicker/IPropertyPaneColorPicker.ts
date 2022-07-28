export interface IPropertyPaneColorPickerProps {
  label: string;
  onPropertyChange: (propertyPath: string, newValue: any) => void;
  selectedKey: string | number;
  disabled?: boolean;
}