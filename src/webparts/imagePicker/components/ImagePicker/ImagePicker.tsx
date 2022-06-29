import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

interface IImagePickerProps {
    sharepointLibrary?: string;
    selectedText?: string;
    buttonText: string;
    panelHeaderText?: string;
    context: any;
}

interface IImagePickerState {
    isOpen: boolean;
    imageSelected: string;
    imagesToDisplay: string[];
    loading: boolean;
}



export default class ImagePicker extends React.Component<IImagePickerProps, IImagePickerState> {
    sp = spfi().using(SPFx(this.props.context));

    constructor(props: IImagePickerProps) {
        super(props);
        this.state = {
            isOpen: false,
            imageSelected: "",
            imagesToDisplay: ["https://picsum.photos/200/300?random=1",
                "https://picsum.photos/200/300?random=2",
                "https://picsum.photos/200/300?random=3"],
            loading: false
        };
    }

    /*SHAREPOINT METHODS*/
    private getImagesFromLibrary = () => {
        this.sp.web.lists.getByTitle(this.props.sharepointLibrary).items.select("FileRef")()
            .then((images) => {
                var imagesURL = [];
                images.forEach(imageItem => {
                    imagesURL.push(imageItem.FileRef);
                })
                this.setState({ imagesToDisplay: imagesURL, loading: false });
            });
    }

    /*PANEL METHODS*/
    private openPanel = () => {
        this.setState({ isOpen: true, loading: true }, () => {
            if (this.props.sharepointLibrary != "") {
                this.getImagesFromLibrary();
            }
            else {
                this.setState({ loading: false });
            }
        });
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
                    {this.state.loading ? <Spinner size={SpinnerSize.large} /> :
                        <ul>
                            {this.state.imagesToDisplay.map((image) => {
                                return (<li>
                                    <img width="200px" onClick={this.selectImage} src={image} />
                                </li>)
                            })}
                        </ul>}
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


