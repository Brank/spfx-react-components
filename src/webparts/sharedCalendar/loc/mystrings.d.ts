declare interface ISharedCalendarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  ListFieldLabel: string;
}

declare module 'SharedCalendarWebPartStrings' {
  const strings: ISharedCalendarWebPartStrings;
  export = strings;
}
