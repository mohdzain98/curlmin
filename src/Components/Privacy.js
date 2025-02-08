import React, { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    document.title = "curlmin | privacy policy";
  }, []);
  return (
    <div id="privacy">
      <div class="container mt-5" style={{ marginTop: "-3%", padding: "0 5%" }}>
        <div class="card shadow-sm mb-4">
          <div class="card-header">
            <h1 className="mt-4 fw-bold text-center my-3">Privacy Policy</h1>
            <p className="text-center" style={{ fontSize: "12px" }}>
              <strong>Effective Date:</strong> 01 Jan, 2025
            </p>
          </div>
          <div class="card-body px-4">
            <p>
              Welcome to Curlmin! Your privacy is important to us. This Privacy
              Policy explains how we collect, use, and protect your information.
            </p>

            <h4 className="mt-4 text-muted">1. Information We Collect</h4>
            <hr />
            <ul>
              <li>
                <strong>Account Information:</strong> When you register, we
                collect your email and basic details to create your account.
              </li>
              <li>
                <strong>URL Data:</strong> We store URLs you shorten, generate
                as QR codes, or save as barcodes.
              </li>
              <li>
                <strong>Analytics:</strong> We collect data on link clicks,
                device types, and geographic locations to provide insights.
              </li>
            </ul>
            <h4 className="mt-4 text-muted">2. How We Use Your Information</h4>
            <hr />
            <ul>
              <li>To create and manage your account.</li>
              <li>
                To provide analytics and usage insights for your shortened links
                and QR codes.
              </li>
              <li>To improve the performance and security of our services.</li>
            </ul>

            <h4 className="mt-4 text-muted">3. Sharing Your Information</h4>
            <hr />
            <p>
              We do not sell, trade, or rent your personal information. We may
              share data only with trusted partners to improve our services or
              as required by law.
            </p>

            <h4 className="mt-4 text-muted">4. Data Security</h4>
            <hr />
            <p>
              We use industry-standard security measures to protect your data.
              However, no method of transmission over the internet is 100%
              secure.
            </p>

            <h4 className="mt-4 text-muted">5. Your Choices</h4>
            <hr />
            <ul>
              <li>
                You can delete or manage your links from your account settings.
              </li>
              <li>You may opt-out of non-essential communications.</li>
            </ul>

            <h4 className="mt-4 text-muted">6. Changes to This Policy</h4>
            <hr />
            <p>
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with the effective date.
            </p>

            <h4 className="mt-4 text-muted">7. Contact Us</h4>
            <hr />
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at{" "}
              <a href="mailto:support@Curlmin.com">support@Curlmin.com</a>.
            </p>
          </div>
          <div class="card-footer text-center ">
            <p>&copy; 2024 Curlmin. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
