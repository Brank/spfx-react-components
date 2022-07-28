import { IColor } from "office-ui-fabric-react";

export interface IColorPickerState {
  loading: boolean;
  error: string;
  color: IColor;
}