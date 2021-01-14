import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ImagePickerWebPartStrings';
import ImagePickerWebpart from './components/ImagePickerWebpart';
import { IImagePickerWebpartProps } from './components/IImagePickerWebpartProps';
import { setup as pnpSetup } from "@pnp/common";


export interface IImagePickerWebPartProps {
  description: string;
}

export default class ImagePickerWebPart extends BaseClientSideWebPart <IImagePickerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IImagePickerWebpartProps> = React.createElement(
      ImagePickerWebpart,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {

    return super.onInit().then(_ => {
      pnpSetup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
