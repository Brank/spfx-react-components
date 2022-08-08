import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons(undefined, { disableWarnings: true });

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'PersonaCarrouselWebPartStrings';
import PersonaCarrousel from './components/PersonaCarrousel';
import { IPersonaCarrouselProps } from './components/IPersonaCarrouselProps';
import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { update } from '@microsoft/sp-lodash-subset';

import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import  { ILists } from "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";


export interface IPersonaCarrouselWebPartProps {
  description: string;
  listName: string;
}



export default class PersonaCarrouselWebPart extends BaseClientSideWebPart<IPersonaCarrouselWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _sp : SPFI;

  public render(): void {
    const element: React.ReactElement<IPersonaCarrouselProps> = React.createElement(
      PersonaCarrousel,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        sharePointLibrary: this.properties.listName
      }
    );

    this._getLibraries().then(() => {
      ReactDom.render(element, this.domElement);
    })
    .catch(()=>{
      console.error("ERROR IN _getLibraries")
    });
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    this._sp = spfi().using(SPFx({pageContext:this.context.pageContext}));

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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
                }),
                new PropertyPaneAsyncDropdown('listName', {
                  label: strings.ListFieldLabel,
                  loadOptions: this._getLibraries.bind(this),
                  onPropertyChange: this._onListChange.bind(this),
                  selectedKey: this.properties.listName
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _getLibraries(): Promise<IDropdownOption[]> {
    const lists: ILists = this._sp.web.lists;
    return lists.filter("BaseTemplate eq 100").select("Title,Id").orderBy("Title")().then((result) => {
      console.log(result);
      const resultItems : IDropdownOption[] = result.map((resultItem)=>{
        const itemProcessed : any = {key:resultItem.Id, text: resultItem.Title}
        return itemProcessed;
      });

      return resultItems;
    });
  }

  private _onListChange(propertyPath: string, newValue: any): void {
    //const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // refresh web part
    this.render();
  }

}