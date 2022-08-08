import * as React from 'react';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { LivePersona } from '@pnp/spfx-controls-react/lib/LivePersona';
import styles from '../PersonaCarrousel.module.scss';

interface ICustomPersonaProps {
    userEmail: string;
    title: string;
    userName: string;
    description: string;
    context: any;
}

interface ICustomPersonaState {
    loading: boolean;
}



export default class CustomPersona extends React.Component<ICustomPersonaProps, ICustomPersonaState> {

    public constructor(props: ICustomPersonaProps) {
        super(props);
        this.state = {
            loading: false
        };
    }

    /*SHAREPOINT METHODS*/

    public render(): React.ReactElement<any> {
        return (
            <LivePersona upn={this.props.userEmail}
                template={
                    <>
                        <section className={styles.section}>
                            <div className={styles.userImageContainer}>
                                <div className={styles.userImageContainer2}>
                                    <div className={styles.userImageContainer3}>
                                        <img className={styles.userImage} src={"/_vti_bin/DelveApi.ashx/people/profileimage?size=L&userId=" + this.props.userEmail} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className={styles.userName}>{this.props.userName}</span>
                            </div>
                            <div>
                                <b>{this.props.title}</b>
                            </div>
                            <div>
                                <span>{this.props.description}</span>
                            </div>
                        </section>
                    </>
                }
                serviceScope={this.props.context.serviceScope}
            />
        );
    }

}


