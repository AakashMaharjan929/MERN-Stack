import React from 'react';
import Slider from 'react-slick';
import { useRef } from 'react';

function BlogHomeContent() {

  const blogData = [
    {
      name: "RECIPIE OF PERFRUME",
      imageSrc: "./blog1.jpg"
    },
    {
      name: "ROSE PERFUME",
      imageSrc: "./blog2.jpg"
    },
    {
      name: "PERFUME WORLD",
      imageSrc: "./blog3.jpg"
    },
    {
      name: "PERFUME FUN",
      imageSrc: "./blog4.jpg"
    },
  ];

  const sliderSettings = {
    arrows:false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
    // variableWidth: true,

    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 777,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  const sliderRef7 = useRef(null);


  return (
    <div className="containerofblog">
      <div className="sliderblog-controls">
        <div className='fromourblogbuttons'>
        <button onClick={() => sliderRef7.current.slickPrev()}> <i className='bi bi-arrow-left'></i> </button>
        <h1>From our Blog</h1>
        <button onClick={() => sliderRef7.current.slickNext()}> <i className='bi bi-arrow-right'></i> </button>
        </div>
      </div>
      <Slider ref={sliderRef7} {...sliderSettings}>
        {blogData.map((blog, index) => (
          <div key={index} className="card">
            <img src={blog.imageSrc} alt={blog.name} />
            <h2 className="cardname">{blog.name}</h2>
            <p className="limited-text">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat doloremque, quisquam fuga dolorum, corrupti quasi magni ullam distinctio facere odio ad. Voluptatum impedit ipsa sapiente placeat a optio saepe consequuntur, hic, quasi deserunt illum molestiae excepturi, ex temporibus explicabo repellendus veniam beatae aliquid. Dolorum fugit consequuntur rem officia a? Nobis, pariatur vero ipsa saepe eius aliquam obcaecati sint, quos at ullam expedita deserunt id distinctio mollitia excepturi vel incidunt qui quas eligendi nesciunt! Laboriosam, minus. Velit dolores amet ea sunt dignissimos cum dolorum repellendus, veniam ullam recusandae inventore accusamus dolore ipsam, dicta quod rerum? Voluptatibus quidem non placeat incidunt beatae!
            </p>
            <p>
              <a href="#">READ MORE...</a>
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BlogHomeContent;
