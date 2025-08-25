import {useState,useEffect} from 'react'
import axios from 'axios';

const BASE_URL = 'http://localhost:4444';

function DashboardComponent() {

  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
   const fetchCompletedCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/checkoutTotal/checkoutAll`);
    // Only count orders that are delivered
    const completedData = response.data.filter(item => item.status === "Delivered");
    setCompletedCount(completedData.length);
  } catch (error) {
    console.error("Error fetching the completed count:", error);
  }
};


    fetchCompletedCount();

    const fetchCancelledCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/checkoutTotal/checkoutAll`);
        const cancelledData = response.data.filter(item => item.status === "Order Placed");
        setCancelledCount(cancelledData.length);
      } catch (error) {
        console.error("Error fetching the cancelled count:", error);
      }
    };

    fetchCancelledCount();

    //fetch number of users
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/signup/find`);
        setUserCount(response.data.length);
      } catch (error) {
        console.error("Error fetching the user count:", error);
      }
    };

    fetchUserCount();

    //get number of products
    const fetchProductCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/allproducts`);
        setProductCount(response.data.length);
      } catch (error) {
        console.error("Error fetching the product count:", error);
      }
    };

    fetchProductCount();
  }, []);



  return (
    <div>
      {/* Top container */}

      {/* Page content */}
      <div className="w3-main">
        {/* Header */}
        <header className="w3-container" style={{ paddingTop: '22px' }}>
          <h5><b><i className="fa fa-dashboard"></i> My Dashboard</b></h5>
        </header>

        <div className="w3-row-padding w3-margin-bottom">
          <div className="w3-quarter">
            <div className="w3-container w3-red w3-padding-16">
              <div className="w3-left"><i className="fa fa-comment w3-xxxlarge"></i></div>
              <div className="w3-right">
                <h3>{productCount}</h3>
              </div>
              <div className="w3-clear"></div>
              <h4>Products</h4>
            </div>
          </div>
          <div className="w3-quarter">
            <div className="w3-container w3-blue w3-padding-16">
              <div className="w3-left"><i className="fa fa-eye w3-xxxlarge"></i></div>
              <div className="w3-right">
                <h3>{userCount}</h3>
              </div>
              <div className="w3-clear"></div>
              <h4>Users</h4>
            </div>
          </div>
          <div className="w3-quarter">
            <div className="w3-container w3-teal w3-padding-16">
              <div className="w3-left"><i className="fa fa-share-alt w3-xxxlarge"></i></div>
              <div className="w3-right">
                <h3>{completedCount}  </h3>
              </div>
              <div className="w3-clear"></div>
              <h4>Completed</h4>
            </div>
          </div>
          <div className="w3-quarter">
            <div className="w3-container w3-orange w3-text-white w3-padding-16">
              <div className="w3-left"><i className="fa fa-users w3-xxxlarge"></i></div>
              <div className="w3-right">
                <h3>{cancelledCount}</h3>
              </div>
              <div className="w3-clear"></div>
              <h4>Pending</h4>
            </div>
          </div>
        </div>

        <div className="w3-panel">
          <div className="w3-row-padding" style={{ margin: '0 -16px' }}>
            <div className="w3-third">
              {/* Other content */}
            </div>
            <div className="w3-twothird">
              <h5>Feeds</h5>
              <table className="w3-table w3-striped w3-white">
                <tbody>
                  <tr>
                    <td><i className="fa fa-user w3-text-blue w3-large"></i></td>
                    <td>New record, over 90 views.</td>
                    <td><i>10 mins</i></td>
                  </tr>
                  <tr>
                    <td><i className="fa fa-bell w3-text-red w3-large"></i></td>
                    <td>Database error.</td>
                    <td><i>15 mins</i></td>
                  </tr>
                  <tr>
                    <td><i className="fa fa-users w3-text-yellow w3-large"></i></td>
                    <td>New record, over 40 users.</td>
                    <td><i>17 mins</i></td>
                  </tr>
                  <tr>
                    <td><i className="fa fa-comment w3-text-red w3-large"></i></td>
                    <td>New comments.</td>
                    <td><i>25 mins</i></td>
                  </tr>
                  <tr>
                    <td><i className="fa fa-bookmark w3-text-blue w3-large"></i></td>
                    <td>Check transactions.</td>
                    <td><i>28 mins</i></td>
                  </tr>
                  <tr>
                    <td><i className="fa fa-laptop w3-text-red w3-large"></i></td>
                    <td>CPU overload.</td>
                    <td><i>35 mins</i></td>
                  </tr>
                  <tr>
                    <td><i className="fa fa-share-alt w3-text-green w3-large"></i></td>
                    <td>New shares.</td>
                    <td><i>39 mins</i></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <hr />
        <div className="w3-container">
          <h5>General Stats</h5>
          <p>New Visitors</p>
          <div className="w3-grey">
            <div className="w3-container w3-center w3-padding w3-green" style={{ width: '25%' }}>+25%</div>
          </div>

          <p>New Users</p>
          <div className="w3-grey">
            <div className="w3-container w3-center w3-padding w3-orange" style={{ width: '50%' }}>50%</div>
          </div>

          <p>Bounce Rate</p>
          <div className="w3-grey">
            <div className="w3-container w3-center w3-padding w3-red" style={{ width: '75%' }}>75%</div>
          </div>
        </div>
        <hr />

        <div className="w3-container">
          <h5>Countries</h5>
          <table className="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
            <tbody>
              <tr>
                <td>United States</td>
                <td>65%</td>
              </tr>
              <tr>
                <td>UK</td>
                <td>15.7%</td>
              </tr>
              <tr>
                <td>Russia</td>
                <td>5.6%</td>
              </tr>
              <tr>
                <td>Spain</td>
                <td>2.1%</td>
              </tr>
              <tr>
                <td>India</td>
                <td>1.9%</td>
              </tr>
              <tr>
                <td>France</td>
                <td>1.5%</td>
              </tr>
            </tbody>
          </table><br />
          <button className="w3-button w3-dark-grey">More Countries  <i className="fa fa-arrow-right"></i></button>
        </div>
        <hr />
        <div className="w3-container">
          <h5>Recent Users</h5>
          <ul className="w3-ul w3-card-4 w3-white">
            <li className="w3-padding-16">
              <img src="/w3images/avatar2.png" className="w3-left w3-circle w3-margin-right" style={{ width: '35px' }} />
              <span className="w3-xlarge">Mike</span><br />
            </li>
            <li className="w3-padding-16">
              <img src="/w3images/avatar5.png" className="w3-left w3-circle w3-margin-right" style={{ width: '35px' }} />
              <span className="w3-xlarge">Jill</span><br />
            </li>
            <li className="w3-padding-16">
              <img src="/w3images/avatar6.png" className="w3-left w3-circle w3-margin-right" style={{ width: '35px' }} />
              <span className="w3-xlarge">Jane</span><br />
            </li>
          </ul>
        </div>
        <hr />

        <div className="w3-container">
          <h5>Recent Comments</h5>
          <div className="w3-row">
            <div className="w3-col m2 text-center">
              <img className="w3-circle" src="/w3images/avatar3.png" style={{ width: '96px', height: '96px' }} />
            </div>
            <div className="w3-col m10 w3-container">
              <h4>John <span className="w3-opacity w3-medium">Sep 29, 2022, 9:12 PM</span></h4>
              <p>Keep up the great work!</p><br />
            </div>
          </div>

          <div className="w3-row">
            <div className="w3-col m2 text-center">
              <img className="w3-circle" src="/w3images/avatar1.png" style={{ width: '96px', height: '96px' }} />
            </div>
            <div className="w3-col m10 w3-container">
              <h4>Bo <span className="w3-opacity w3-medium">Sep 28, 2022, 10:15 PM</span></h4>
              <p>Great to see the progress.</p><br />
            </div>
          </div>
        </div>
        <br />
        <div className="w3-container w3-padding-32 w3-center"> 
          <h4>Footer</h4>
          <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank" rel="noopener noreferrer">w3.css</a></p>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent