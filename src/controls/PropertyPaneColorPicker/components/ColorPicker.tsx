import * as React from 'react';
import { ColorPicker, IColorPickerStyles } from '@fluentui/react/lib/ColorPicker';
import { IColorPickerProps } from './IColorPickerProps';
import { IColorPickerState } from './IColorPickerState';
import { getColorFromString, IColor } from 'office-ui-fabric-react';

const white : IColor = getColorFromString('#ffffff')!;

const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: 12 },
  root: {
    maxWidth: 250,
    minWidth: 250,
  },
  colorRectangle: { height: 268 },
};

export default class CustomColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {
  private _selectedKey: React.ReactText;
  

  public constructor(props: IColorPickerProps, state: IColorPickerState) {
    super(props);
    this._selectedKey = props.selectedKey;

    this.state = {
      loading: false,
      color : white,
      error: undefined
    };

    
  }

  public componentDidMount(): void {
    this._loadOptions();
  }

  public componentDidUpdate(prevProps: IColorPickerProps, prevState: IColorPickerState): void {
    if (this.props.disabled !== prevProps.disabled ||
      this.props.stateKey !== prevProps.stateKey) {
      this._loadOptions();
    }
  }

  private _loadOptions(): void {
    this.setState({
      loading: true,
      error: undefined
    });
  }

  public render(): JSX.Element {
    return (
      <div>
        <ColorPicker
        color={this.state.color}
        onChange={this._onColorChanged}
        showPreview={true}
        styles={colorPickerStyles}
        // The ColorPicker provides default English strings for visible text.
        // If your app is localized, you MUST provide the `strings` prop with localized strings.
        strings={{
          // By default, the sliders will use the text field labels as their aria labels.
          // Previously this example had more detailed instructions in the labels, but this is
          // a bad practice and not recommended. Labels should be concise, and match visible text when possible.
          hueAriaLabel: 'Hue',
        }}
      />
      </div>
    );
  }

  private _onColorChanged = (ev: any, colorObj: IColor) : void => {
    this.setState({color: colorObj});

    if (this.props.onChanged) {
      this.props.onChanged(colorObj.hex);
    }

  }
}