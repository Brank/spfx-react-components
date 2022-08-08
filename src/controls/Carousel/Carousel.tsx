import * as React from 'react';
import { ICarouselProps } from './ICarouselProps';
import { ICarouselState } from './ICarouselState';
import styles from './Carousel.module.scss';
import { FontIcon } from '@fluentui/react/lib/Icon';

export default class Carousel extends React.Component<ICarouselProps, ICarouselState> {
  private _selectedKey: React.ReactText;


  public constructor(props: ICarouselProps, state: ICarouselState) {
    super(props);

    this.state = {
      loading: false,
      currentIndex: 0,
      error: undefined
    };
  }

  public render(): JSX.Element {
    console.log(this.state.currentIndex);
    return (
      <section className={styles.slider}>
        <FontIcon aria-label="ChevronLeft" iconName="ChevronLeft" className={styles['left-arrow']} onClick={this._handleBackClick} />
        <FontIcon aria-label="ChevronRight" iconName="ChevronRight" className={styles['right-arrow']} onClick={this._handleForwardClick} />
        {
          this.props.elements.map((slide, index) => {
            return (
              <div className={index === this.state.currentIndex ? styles.slide + " " + styles.active : styles.slide} key={index}>
                  {index === this.state.currentIndex && (slide)}
              </div>)
          })
        }
      </section>
    );
  }

  private _handleForwardClick = () : void => {
    //this.setState({ currentIndex: ((((this.state.currentIndex + 1) % this.props.elements.length) + this.props.elements.length) % this.props.elements.length), loading: false })
    this.setState({ currentIndex: this.state.currentIndex === this.props.elements.length - 1 ? 0 : this.state.currentIndex + 1, loading: false })
  }

  private _handleBackClick = () : void => {
    // this.setState({ currentIndex: ((((this.state.currentIndex - 1) % this.props.elements.length) + this.props.elements.length) % this.props.elements.length), loading: true })
    this.setState({ currentIndex: this.state.currentIndex === 0 ? this.props.elements.length - 1 : this.state.currentIndex - 1, loading: false })

  }
}