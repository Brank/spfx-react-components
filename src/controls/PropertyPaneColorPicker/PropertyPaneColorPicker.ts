import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType
} from '@microsoft/sp-property-pane';
import { IPropertyPaneColorPickerProps } from './IPropertyPaneColorPicker';
import { IPropertyPaneColorPickerInternalProps } from './IPropertyPaneColorPickerInternalProps';
import ColorPicker from './components/ColorPicker';
import { IColorPickerProps } from './components/IColorPickerProps';

export class PropertyPaneColorPicker implements IPropertyPaneField<IPropertyPaneColorPickerProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneColorPickerInternalProps;
  private _elem: HTMLElement;

  public constructor(targetProperty: string, properties: IPropertyPaneColorPickerProps) {
    this.targetProperty = targetProperty;
    this.properties = {
      key: properties.label,
      label: properties.label,
      onPropertyChange: properties.onPropertyChange,
      selectedKey: properties.selectedKey,
      disabled: properties.disabled,
      onRender: this._onRender.bind(this),
      onDispose: this._onDispose.bind(this)
    };
  }

  public render(): void {
    if (!this._elem) {
      return;
    }

    this._onRender(this._elem);
  }

  private _onDispose(element: HTMLElement): void {
    ReactDom.unmountComponentAtNode(element);
  }

  private _onRender(elem: HTMLElement): void {
    if (!this._elem) {
      this._elem = elem;
    }

    const element: React.ReactElement<IColorPickerProps> = React.createElement(ColorPicker, {
      label: this.properties.label,
      onChanged: this._onChanged.bind(this),
      selectedKey: this.properties.selectedKey,
      disabled: this.properties.disabled,
      // required to allow the component to be re-rendered by calling this.render() externally
      stateKey: new Date().toString()
    });
    ReactDom.render(element, elem);
  }

  private _onChanged(color: string): void {
    this.properties.onPropertyChange(this.targetProperty, color);
  }
}