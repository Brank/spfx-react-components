import * as React from 'react';
import styles from './ImagePickerWebpart.module.scss';
import { IImagePickerWebpartProps } from './IImagePickerWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ImagePicker from './ImagePicker/ImagePicker';

export default class ImagePickerWebpart extends React.Component<IImagePickerWebpartProps, {}> {
  public render(): React.ReactElement<IImagePickerWebpartProps> {
    return (
      <div className={ styles.imagePicker }>
        <ImagePicker />
      </div>
    );
  }
}
