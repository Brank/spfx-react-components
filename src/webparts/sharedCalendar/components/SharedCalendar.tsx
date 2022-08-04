import * as React from 'react';
import styles from './SharedCalendar.module.scss';
import { ISharedCalendarProps } from './ISharedCalendarProps';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import "@pnp/sp/webs";
import  { IList } from "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/forms/list";
import { IFrameDialog } from "@pnp/spfx-controls-react/lib/IFrameDialog";
import { DialogType } from '@fluentui/react/lib/Dialog';

const eventColors : string[] = [
 "rgb(164, 38, 44)",
 "rgb(202, 80, 16)",
 "rgb(152, 111, 11)",
 "rgb(73, 130, 5)",
 "rgb(3, 120, 124)",
 "rgb(0, 120, 212)",
 "rgb(0, 78, 140)",
 "rgb(0, 78, 140)",
 "rgb(136, 23, 152)",
 "rgb(135, 100, 184)"
]//10 different colors for default

export default class SharedCalendar extends React.Component<ISharedCalendarProps, {}> {
  public state : any;

  public constructor(props : ISharedCalendarProps)
  {
    super(props);
    this.state = {    
      events : [],
      showEvent: false,
      displayFormURL : "",
      eventToDisplayID: ""
    }

    this._getCalendarEvents();
  }

  public render(): React.ReactElement<ISharedCalendarProps> {
    const {
      //description,
      //isDarkTheme,
      //environmentMessage,
      hasTeamsContext,
      //userDisplayName
    } = this.props;

    return (
      <section className={`${styles.sharedCalendar} ${hasTeamsContext ? styles.teams : ''}`}>
        <style>
        .fc .fc-button-primary {"{"}
          color: #fff;
          color: var(--fc-button-text-color,#fff);
          background-color: #{this.props.themeColor};
          {/* border-color: #2c3e50; */}
          border-color: var(--fc-button-border-color,#2c3e50);
        {"}"}
        </style>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin ]}
            eventClick={this._handleEventClick}
            initialView="dayGridMonth"
            events={this.state.events}
          />
          {
            this.state.showEvent ? <IFrameDialog 
            url={this.state.displayFormURL + "?ID=" + this.state.eventToDisplayID}
            iframeOnLoad={this._onIframeLoaded}
            hidden={false}
            onDismiss={this._onDialogDismiss}
            modalProps={{
                isBlocking: true,
                //containerClassName: styles.dialogContainer
            }}
            dialogContentProps={{
                type: DialogType.close,
                showCloseButton: true
            }}
            width={'570px'}
            height={'400px'}
            scrolling={"true"} /> : <div />
          }
      </section>
    );
  }

  private _handleEventClick = (arg) : void => { // bind with an arrow function
    this.setState({eventToDisplayID : arg.event.id, showEvent: true});
  }

  private _onIframeLoaded = (iframe: any): void => {
    //
    // some additional configuration to beutify content of the iframe
    //
    const iframeWindow: Window = iframe.contentWindow;
    const iframeDocument: Document = iframeWindow.document;

    const s4Workspace: HTMLDivElement = iframeDocument.getElementById('s4-workspace') as HTMLDivElement;
    s4Workspace.style.height = iframe.style.height;

    const deltaPlace : HTMLDivElement = iframeDocument.getElementById('DeltaPlaceHolderMain') as HTMLDivElement;
    deltaPlace.scrollIntoView({inline: "start"});

    const buttonsForm : NodeListOf<HTMLInputElement>= iframeDocument.querySelectorAll("[type=button]");
    buttonsForm.forEach((button : HTMLInputElement) => {
      button.onclick = this._onDialogDismiss;
    });
}

private _onDialogDismiss = (): void => {
  this.setState({
    showEvent: false
  });
}

  private _getCalendarEvents = () : void => {
    const list: IList = this.props.sp.web.lists.getById(this.props.listName);
    const promisesList : Promise<any>[] = [];
    let eventItems : any[];
    let displayFormURL : string;
    let eventCategories : string[];

    promisesList.push(list.forms.select("ServerRelativeUrl").filter("FormType eq 4")().then((resultForm) => {
      displayFormURL = resultForm[0].ServerRelativeUrl;
    }));


    promisesList.push(list.items().then((result) => {
      eventItems = result;
      eventCategories = eventItems.reduce((categories, event) => {
        if(!categories.some(obj => obj === event.Category && obj === event.Category)) {
          categories.push(event.Category);
        }
        return categories;
    },[]);
    }));

    Promise.all(promisesList).then(()=>{
      const eventItemsProcessed : any[] = eventItems.map((resultItem)=>{
        const itemProcessed : any = {title:resultItem.Title, start: resultItem.EventDate, end: resultItem.EndDate, id: resultItem.ID, backgroundColor: eventColors[eventCategories.indexOf(resultItem.Category)]};
        return itemProcessed;
      });

      this.setState({events : eventItemsProcessed, displayFormURL: displayFormURL});
    }).catch(()=>{
      console.error("Error while trying to receive calendar events");
    }); 
  }
}
