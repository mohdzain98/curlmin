import React from "react";
import "./Styling/home.css";
import { useNavigate } from "react-router";

const Categories = () => {
  const navigate = useNavigate();
  const categories = [
    {
      title: "QR Code",
      icon: "fa-qrcode",
      catic: "fa",
      href: "/qrcode",
      desc: "Turn your long URLs or UPI ids with or without fixed amount into QR codes effortlessly for instant sharing. ",
      new: false,
    },
    {
      title: "Barcode",
      icon: "fa-barcode",
      catic: "fa",
      href: "/barcode",
      desc: "Simplify your long URLs with sleek barcodes for universal compatibility.",
      new: false,
    },
    {
      title: "Curltag",
      icon: require("../../Assets/sigmatag.jpg"),
      catic: "im",
      href: "/curltag",
      desc: "Share with Curltag modern and stylish link solutions with background images",
      new: false,
    },
    {
      title: "Images",
      icon: "fa-image",
      catic: "fa",
      href: "/image",
      desc: "Transform your visual assets into links for creative storytelling.",
      new: true,
    },
  ];

  return (
    <div className="px-4 py-5" id="qr">
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-2">More then just URL</h2>
        <p className="text-center text-muted fw-bold mb-5">
          Share your QRs, Barcodes, Curltags and Images with shorts URLs
        </p>
        <div className="row">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="col-md-3 mb-4 cat"
              onClick={() =>
                category.href === "/"
                  ? window.scrollTo({ top: 0, behavior: "smooth" })
                  : navigate(category.href)
              }
            >
              <div className="card category-card text-center shadow-sm h-100 ">
                {category.new && (
                  <span
                    className="badge bg-danger position-absolute top-0 end-0 m-2"
                    style={{ zIndex: 1 }}
                  >
                    NEW
                  </span>
                )}
                <div className="card-body">
                  {category.catic === "fa" ? (
                    <i
                      className={`fas ${category.icon} fa-3x mb-3 text-primary`}
                    ></i>
                  ) : (
                    <img
                      src={category.icon}
                      alt={category.title}
                      className="category-image img-fluid mb-1"
                      style={{ widh: "60px", height: "60px" }}
                    />
                  )}
                  {/* <i
                    className={`fas ${category.icon} fa-3x mb-3 text-primary`}
                  ></i> */}
                  <h5 className="card-title">{category.title}</h5>
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    {category.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
