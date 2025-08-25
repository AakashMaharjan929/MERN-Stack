import React from 'react';

const Peaksale = () => {
    return (
        <div className="peaksale">
            <div className="sub-div hover-effect" style={{ backgroundImage: "url('../../public/banner1.jpg')" }}>
                <div className="text">
                    <h3>SALE UP TO</h3><br /><br /><br /><br />
                    <h1>50%</h1><br /><br /><br />
                    <p>PERFUMES &<br />
                         BODY SPRAY</p><br />
                </div>
            </div>
            <div className="sub-div hover-effect" style={{ backgroundImage: "url('../../public/banner2.jpg')" }}>
                <div className="text">
                <h3>SALE UP TO</h3><br /><br /><br /><br />
                    <h1>70%</h1><br /><br /><br />
                    <p>QUEODRANTS<br />
                         </p><br />
                </div>
            </div>
            <div className="sub-div hover-effect" style={{ backgroundImage: "url('../../public/banner3.jpg')" }}>
                <div className="text">
                <h3>SALE UP TO</h3><br /><br /><br /><br />
                    <h1>30%</h1><br /><br /><br />
                    <p>SEDUCTION<br />
                         </p><br />
                 
                </div>
            </div>
        </div>
    );
};

export default Peaksale;