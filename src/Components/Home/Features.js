import React from "react";
import "./Styling/home.css";

const Features = () => {
  const features = [
    {
      title: "Not Just Url",
      desc: "Take your url to qrcodes, barcodes, and curltags to showcase them anywhere either it is product or purchase.",
      icon: "fa-image",
    },
    {
      title: "Password Protection",
      desc: "Secure your links with a password.",
      icon: "fa-lock",
    },
    {
      title: "Time to Live",
      desc: "Set expiry times for your links.",
      icon: "fa-clock",
    },
  ];

  return (
    <div className="p-4" style={{ backgroundColor: "whitesmoke" }} id="feat">
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-5">Features that Inspire</h2>
        <div className="row">
          {features.map((feat, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className={`fas ${feat.icon}`}></i>
                </div>
                <h3 className="h5 fw-bold mb-2">{feat.title}</h3>
                <p className="text-muted">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
