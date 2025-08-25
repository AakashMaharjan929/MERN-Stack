import React from 'react';
import Slider from 'react-slick';

const ThumbnailSlider = ({ images }) => {
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
       {images.map((image, index) => (
        <div key={index} className="thumbnail-item">
          <img src={image.imageSrc} alt={`Thumbnail ${index}`} />
        </div>
      ))}
    </Slider>
  );
};
const ThumbnailSlider2 = ({ images }) => {
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 2,
    slidesToScroll: 1,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Product thumbnail ${index}`} />
        </div>
      ))}
    </Slider>
  );
};

export { ThumbnailSlider, ThumbnailSlider2 };
