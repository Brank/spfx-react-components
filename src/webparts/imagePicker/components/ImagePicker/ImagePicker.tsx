import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

interface IImagePickerProps {
    sharepointLibrary? : string;
    selectedText? : string;
    buttonText: string;
    panelHeaderText?: string;
}

interface IImagePickerState {
    isOpen : boolean;
    imageSelected : string;
    imagesToDisplay : string[];
}

export default class ImagePicker extends React.Component<IImagePickerProps, IImagePickerState> {

    constructor(props: IImagePickerProps) {
        super(props);
        this.state = {
            isOpen: false,
            imageSelected: "",
            imagesToDisplay : []
        };
        if(this.props.sharepointLibrary != "")
        {
            this.getImagesFromLibrary();
        }
        else
        {
            this.setState({imagesToDisplay:
                ["https://picsum.photos/200/300?random=1",
                "https://picsum.photos/200/300?random=2",
                "https://picsum.photos/200/300?random=3"]});
        }
    }

    /*SHAREPOINT METHODS*/
    private getImagesFromLibrary = () => {
        sp.web.lists.getByTitle(this.props.sharepointLibrary).items.get()
        .then((items)=>{
            console.log(items);
        });
    } 

    /*PANEL METHODS*/
    private openPanel = () => {
        this.setState({ isOpen: true });
    }

    private dismissPanel = () => {
        this.setState({ isOpen: false });
    }

    /*CLICK HANDLER*/
    private selectImage = (e) => {
        e.preventDefault();
        this.setState({ imageSelected: e.target.src, isOpen: false });
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <DefaultButton text={this.props.buttonText} onClick={this.openPanel} />
                <Panel
                    headerText={this.props.panelHeaderText}
                    isOpen={this.state.isOpen}
                    onDismiss={this.dismissPanel}
                    // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
                    closeButtonAriaLabel="Close"
                >
                    <ul>
                        <li>
                            <img width="200px" onClick={this.selectImage} src="https://picsum.photos/200/300?random=1" />
                        </li>
                        <li>
                            <img width="200px" onClick={this.selectImage} src="https://picsum.photos/200/300?random=2" />
                        </li>
                        <li>
                            <img width="200px" onClick={this.selectImage} src="https://picsum.photos/200/300?random=3" />
                        </li>
                    </ul>

                </Panel>
                {this.state.imageSelected === "" ? <div></div> :
                    <div>
                        <span>{this.props.selectedText}</span>
                        <div>
                            <img width="200px" src={this.state.imageSelected}></img>
                        </div>
                    </div>}
            </div>
        );
    }

}


