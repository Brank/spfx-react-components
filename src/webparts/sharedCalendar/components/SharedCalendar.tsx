import * as React from 'react';
import styles from './SharedCalendar.module.scss';
import { ISharedCalendarProps } from './ISharedCalendarProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import "@pnp/sp/webs";
import  { IList } from "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/forms/list";


export default class SharedCalendar extends React.Component<ISharedCalendarProps, {}> {
  public state : any;

  public constructor(props : ISharedCalendarProps)
  {
    super(props);
    this.state = {    
      events : []
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
            dateClick={this._handleDateClick}
            initialView="dayGridMonth"
            events={this.state.events}
          />
      </section>
    );
  }

  private _handleDateClick = (arg) : void => { // bind with an arrow function
    alert(arg.dateStr)
    console.log(arg);
  }


  private _getCalendarEvents = () : void => {
    const list: IList = this.props.sp.web.lists.getById(this.props.listName);
    const promisesList : Promise<any>[] = [];
    let eventItems : any[];
    let displayFormURL : string;

    promisesList.push(list.forms.select("ServerRelativeUrl").filter("FormType eq 4")().then((resultForm) => {
      displayFormURL = resultForm[0].ServerRelativeUrl;
    }));


    promisesList.push(list.items().then((result) => {
      eventItems = result;
    }));

    Promise.all(promisesList).then(()=>{
      const eventItemsProcessed : any[] = eventItems.map((resultItem)=>{
        const itemProcessed : any = {title:resultItem.Title, start: resultItem.EventDate, end: resultItem.EndDate, url: displayFormURL + "?ID=" + resultItem.ID};
        return itemProcessed;
      });

      this.setState({events : eventItemsProcessed});
    }).catch(()=>{
      console.error("Error while trying to receive calendar events");
    }); 
  }
}
