import * as React from 'react';
import styles from './ImagePicker.module.scss';
import { IImagePickerProps } from './IImagePickerProps';
import ImagePicker2 from './ImagePicker/ImagePicker';

export default class ImagePicker extends React.Component<IImagePickerProps, {}> {
  public render(): React.ReactElement<IImagePickerProps> {
    /*const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      context
    } = this.props;*/

    return (
      <div className={ styles.imagePicker }>
        <ImagePicker2 buttonText="Click to select an Image"
         panelHeaderText="Select an Image" 
         selectedText="You have selected: "
         sharepointLibrary="Imagenes"
         context={this.props.context}
         />
      </div>
    );
  }
}
