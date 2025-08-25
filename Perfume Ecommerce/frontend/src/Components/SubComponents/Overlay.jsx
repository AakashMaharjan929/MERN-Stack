import React from 'react'

function closeoverlay(){
    document.getElementById('overlay').style.display = 'none';
  }

  
  

  const Overlay = () => {
    const closeOverlay = () => {
      // your close overlay logic here
    };
  
    return (
      <div id="overlay" className="overlay">
        <div className="overlay_container">
          <div className="left">
            <div className="overlay_img" id="overlay-img">
              {/* content */}
            </div>
            <div className="overlay_img2" id="overlay-img2">
              {/* content */}
            </div>
          </div>
          <div className="right">
            <button id="closeOverlayBtn" onClick={closeOverlay}><i className="bi bi-x"></i></button>
  
            <h2 className="title">DOLCE & GABBANA The Only One</h2>
            <div className="price">Rs. 5999</div>
            <div className="description">
              {/* content */}
            </div>
            <div className="details-group">
              <label htmlFor="size">SIZE</label>
              <select name="" id="group-size">
                {/* options */}
              </select>
            </div>
            {/* other content */}
            <a className="add-to-cart" href="#">ADD TO CART</a>
            {/* other content */}
          </div>
        </div>
      </div>
    );
  };
  
  export default Overlay;