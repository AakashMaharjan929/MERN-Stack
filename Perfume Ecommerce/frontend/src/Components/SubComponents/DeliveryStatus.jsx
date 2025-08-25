import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "../../css/DeliveryStatus.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:4444";

function DeliveryStatus() {
  const [name, setName] = useState("");
  const [checkoutData, setCheckoutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState({});
  const navigate = useNavigate();

  // Fetch username
  useEffect(() => {
    axios
      .get(`${BASE_URL}/check`)
      .then((response) => {
        if (response.data.valid) {
          axios.get(`${BASE_URL}/signup/details`).then((res) => {
            if (res.data.username !== "Admin") {
              setName(res.data.username);
            }
          });
        }
      })
      .catch(console.error);
  }, []);

  // Fetch single product image
  const fetchProductImage = async (title) => {
    try {
      const res = await axios.get(`${BASE_URL}/allproducts/search?title=${encodeURIComponent(title)}`);
      if (res.data && res.data.length > 0) {
        return res.data[0].imageSrc;
      }
      return null;
    } catch (error) {
      console.error("Error fetching product image for", title, error);
      return null;
    }
  };

  // Fetch checkout data + product images
  useEffect(() => {
    if (!name) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/checkoutTotal/userCheckout/${name}`);
        if (res.data.status) {
          const data = res.data.data;
          setCheckoutData(data);

          // Build productImages map for all titles across orders
          const imageMap = {};
          const imageFetches = [];

          data.forEach((order) => {
            order.title.forEach((title) => {
              if (!imageMap[title]) {
                imageFetches.push(
                  fetchProductImage(title).then((img) => {
                    if (img) imageMap[title] = img;
                  })
                );
              }
            });
          });

          await Promise.all(imageFetches);
          setProductImages(imageMap);
        } else {
          setError(res.data.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message || "Fetch error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const renderStep = (status) => {
    const steps = ["Packing", "Shipped", "Out for Delivery", "Delivered"];
    const current = steps.findIndex((s) => s.toLowerCase() === status?.toLowerCase());
    return (
      <div className="progress-container">
        {steps.map((step, i) => (
          <div className={`step ${i <= current ? "active" : ""}`} key={i}>
            <div className="circle">{i <= current ? "✓" : ""}</div>
            <span className="label">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="delivery-container">
        <h2>
          Delivery Status for <span className="highlight">{name}</span>
        </h2>

        {loading && <p className="center">Loading...</p>}
        {error && <p className="center error">{error}</p>}
        {!loading && !error && checkoutData.length === 0 && (
          <p className="center">No delivery records found.</p>
        )}

        {!loading && !error && checkoutData.length > 0 && (
          <div className="orders">
         {checkoutData.map((item) => (
  <div className="order-card" key={item._id}>
    <div className="order-header">
      <div>
        <p>
          <strong>Order ID:</strong> #{item._id.slice(-6)}
        </p>
        <p>
          <strong>Delivery Address:</strong> {item.address}
        </p>
      </div>
      <div className="status-badge">{item.status || "Pending"}</div>
    </div>

    {renderStep(item.status)}

    {item.title.map((title, idx) => (
      <div className="product" key={idx}>
        <div className="productDetails">
          <img
            src={
              productImages[title]
                ? `${BASE_URL}/public/AllProducts/${productImages[title]}`
                : "/images/default-product.png"
            }
            alt={title}
          />
          <div className="product-info">
            <h3>{title}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", width: "7rem" }}>
              <p>Size: {item.size[idx]}ml</p>
              <p>Qty: {item.quantity[idx]}</p>
            </div>
          </div>
        </div>
      </div>
    ))}

    {/* ✅ Total price shown once here */}
    <div className="price" style={{ textAlign: "right", marginTop: "0.5rem", color: "black" }}>
      <strong>Rs. {item.totalPrice}</strong>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </>
  );
}

export default DeliveryStatus;
