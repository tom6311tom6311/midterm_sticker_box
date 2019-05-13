import React from 'react';
import Slider from 'react-slick';
import ImageThumbail from './ImageThumbnail.component';

const Images = [
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
  {
    name: 'Sample.jpg',
    src: 'https://source.unsplash.com/random/800x600',
  },
];

const settings = {
  dots: false,
  infinite: false,
  slidesToScroll: 1,
  variableWidth: true,
  arrows: true,
};

const ThumbSlider = () => (
  <div style={{ width: '80%' }}>
    <Slider {...settings}>
      {Images && Images.map((image, index) => <div key={`thumb_${index}`}><ImageThumbail src={image.src} /></div>)}
    </Slider>
  </div>
);

export default ThumbSlider;
