import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { SPFI, spfi, SPFx } from "@pnp/sp";
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
    private _sp : SPFI = spfi().using(SPFx(this.props.context));

    public constructor(props: IImagePickerProps) {
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
    private _getImagesFromLibrary = () : void => {
        this._sp.web.lists.getById(this.props.sharepointLibrary).items.select("FileRef")()
            .then((images) => {
                const imagesURL : any[] = [];
                images.forEach(imageItem => {
                    imagesURL.push(imageItem.FileRef);
                })
                this.setState({ imagesToDisplay: imagesURL, loading: false });
            })
            .catch(()=>{
                console.error("Error in _getImagesFromLibrary");
            });
    }

    /*PANEL METHODS*/
    private _openPanel = () :void => {
        this.setState({ isOpen: true, loading: true }, () => {
            if (this.props.sharepointLibrary !== "") {
                this._getImagesFromLibrary();
            }
            else {
                this.setState({ loading: false });
            }
        });
    }

    private _dismissPanel = () : void => {
        this.setState({ isOpen: false });
    }

    /*CLICK HANDLER*/
    private _selectImage = (e) : void => {
        e.preventDefault();
        this.setState({ imageSelected: e.target.src, isOpen: false });
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <DefaultButton text={this.props.buttonText} onClick={this._openPanel} />
                <Panel
                    headerText={this.props.panelHeaderText}
                    isOpen={this.state.isOpen}
                    onDismiss={this._dismissPanel}
                    // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
                    closeButtonAriaLabel="Close"
                >
                    {this.state.loading ? <Spinner size={SpinnerSize.large} /> :
                        <ul>
                            {this.state.imagesToDisplay.map((image, index) => {
                                return (<li key={index}>
                                    <img width="200px" onClick={this._selectImage} src={image} />
                                </li>)
                            })}
                        </ul>}
                </Panel>
                {this.state.imageSelected === "" ? <div /> :
                    <div>
                        <span>{this.props.selectedText}</span>
                        <div>
                            <img width="200px" src={this.state.imageSelected} />
                        </div>
                    </div>}
            </div>
        );
    }

}


