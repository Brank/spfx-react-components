import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';

interface IImagePicker {

}

export default class ImagePicker extends React.Component<IImagePicker, { isOpen, imageSelected }> {

    constructor(props: IImagePicker) {
        super(props);
        this.state = {
            isOpen: false,
            imageSelected: ""
        };

    }

    private openPanel = () => {
        this.setState({ isOpen: true });
    }

    private dismissPanel = () => {
        this.setState({ isOpen: false });
    }

    private selectImage = (e) => {
        e.preventDefault();
        this.setState({ imageSelected: e.target.src, isOpen: false });
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <DefaultButton text="Open panel" onClick={this.openPanel} />
                <Panel
                    headerText="Sample panel"
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
                        <span>You selected the following Image: </span>
                        <div>
                            <img width="200px" src={this.state.imageSelected}></img>
                        </div>
                    </div>}
            </div>
        );
    }

}


