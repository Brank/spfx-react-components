import { SPFI } from "@pnp/sp";

export interface ISharedCalendarProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  listName: string;
  themeColor: string;
  sp : SPFI;
}
