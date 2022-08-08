import * as React from 'react';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import { IPersonaCarrouselProps } from './IPersonaCarrouselProps';
import Carousel from '../../../controls/Carousel/Carousel';
import CustomPersona from './CustomPersona/CustomPersona';

interface IPersonalCarrouselState {
  itemsToDisplay: any[];
  loading: boolean;
}

export default class PersonaCarrousel extends React.Component<IPersonaCarrouselProps, IPersonalCarrouselState> {
  private _sp: SPFI = spfi().using(SPFx(this.props.context));

  public constructor(props : IPersonaCarrouselProps)
  {
    super(props);
    this.state = {    
      itemsToDisplay : [],
      loading: true
    }

    this._getItemsFromLibrary();
  }

  public render(): React.ReactElement<IPersonaCarrouselProps> {
    const {
      /*description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,*/
      context
    } = this.props;

    const itemsToDisplayElement : any[] = [];

    this.state.itemsToDisplay.forEach((item, index) => {
      itemsToDisplayElement.push(<CustomPersona userName={item.User.Title} userEmail={item.User.EMail} title={item.Title} description={item.Description} context={context} key={index} />)
    });

    return (
      <div>
        <Carousel elements={itemsToDisplayElement} />
      </div>

    );
  }

      /*SHAREPOINT METHODS*/
      private _getItemsFromLibrary = () : void => {
        this._sp.web.lists.getById(this.props.sharePointLibrary).items.select("ID,Title,User/Title,User/EMail,Description").expand("User/ID")()
            .then((items) => {
                this.setState({ itemsToDisplay: items, loading: false });
            })
            .catch(()=>{
                console.error("Error in _getImagesFromLibrary");
            });
    }
}
