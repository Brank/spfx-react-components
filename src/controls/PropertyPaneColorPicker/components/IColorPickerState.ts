import { IColor } from "@fluentui/react";

export interface IColorPickerState {
  loading: boolean;
  error: string;
  color: IColor;
}