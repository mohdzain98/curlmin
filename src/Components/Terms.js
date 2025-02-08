import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  useEffect(() => {
    document.title = "curlmin | terms";
  }, []);
  return (
    <div id="terms">
      <div
        className="container mt-5"
        style={{ marginTop: "-3%", padding: "0 5%" }}
      >
        <div class="card shadow-sm mb-4">
          <div class="card-header">
            <h1 className="mt-4 fw-bold text-center my-3">Terms of Service</h1>
            <p className="text-center" style={{ fontSize: "12px" }}>
              <strong>Effective Date:</strong> 01 Feb, 2025
              <p>
                <strong>Country: </strong> India
              </p>
            </p>
          </div>
          <div class="card-body px-4">
            <p>
              Welcome to <span className="mark">curlmin</span> ("we," "our," or
              "us"). By using our URL shortening services, you agree to the
              following Terms of Service. Please read them carefully. If you do
              not agree to these terms, you are prohibited from using our
              services.
            </p>
            <h4 className="mt-4 text-muted">1. Acceptance of Terms</h4>
            <hr />
            <p>
              By accessing or using our services, you confirm that you are at
              least 18 years old or have parental/guardian consent, and that you
              are legally able to agree to these Terms of Service.
            </p>
            <h4 className="mt-4 text-muted">2. Use of the Service</h4>
            <hr />
            <p>
              Our platform enables users to shorten URLs for easier sharing and
              tracking. By using our services, you agree to the following:
            </p>
            <ul>
              <li>
                <strong>Prohibited Content:</strong>
                <ul>
                  <li>
                    You may not shorten URLs that link to illegal, harmful, or
                    inappropriate content, including but not limited to:
                  </li>
                  <ul>
                    <li>
                      Content promoting violence, hate speech, or harassment.
                    </li>
                    <li>Pornographic or explicit material.</li>
                    <li>Phishing, malware, or deceptive websites.</li>
                    <li>Fraudulent, illegal, or misleading activities.</li>
                  </ul>
                  <li>
                    Any URL violating these terms will be removed immediately,
                    and offending users may be banned without notice.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Accuracy of Content:</strong> You are responsible for
                ensuring the accuracy and validity of the URLs you shorten.
              </li>
              <li>
                <strong>Non-Commercial Use:</strong> You may not use the service
                for unsolicited commercial activities, including spam or mass
                advertising, without prior approval.
              </li>
            </ul>
            <h4 className="mt-4 text-muted">3. Intellectual Property</h4>
            <hr />
            <p>
              All intellectual property rights related to our services,
              including trademarks, logos, and designs, are owned by us. You may
              not reproduce, distribute, or create derivative works from our
              platform without express written permission.
            </p>

            <h4 className="mt-4 text-muted">4. Privacy</h4>
            <hr />
            <p>
              We respect your privacy and are committed to protecting your
              personal information. Please refer to our{" "}
              <Link to="/privacy-policy">Privacy Policy</Link> for details on
              how we collect, use, and protect your data.
            </p>

            <h4 className="mt-4 text-muted">5. Limitation of Liability</h4>
            <hr />
            <ul>
              <li>
                <strong>No Warranties:</strong> Our service is provided "as is"
                without any warranties, express or implied. We do not guarantee
                that the service will be error-free or uninterrupted.
              </li>
              <li>
                <strong>Liability Limitations:</strong> We are not liable for
                any damages resulting from your use of our services, including
                but not limited to data loss, misuse, or third-party actions.
              </li>
            </ul>

            <h4 className="mt-4 text-muted">6. Termination of Service</h4>
            <hr />
            <p>
              We reserve the right to suspend or terminate your access to our
              services at any time without notice for violations of these Terms
              of Service or for any other reason we deem necessary.
            </p>

            <h4 className="mt-4 text-muted">7. Governing Law</h4>
            <hr />
            <p>
              These terms are governed by and construed in accordance with the
              laws of India. Any disputes arising from the use of our services
              will be resolved in the courts of India.
            </p>

            <h4 className="mt-4 text-muted">8. Changes to the Terms</h4>
            <hr />
            <p>
              We may revise these Terms of Service from time to time. Updated
              terms will be posted on this page with the effective date. Your
              continued use of the service constitutes acceptance of any
              changes.
            </p>

            <h4 className="mt-4 text-muted">9. Contact Us</h4>
            <hr />
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
              <a
                href="mailto:support@curlmin.com"
                className="ms-1"
                style={{ textDecoration: "none", color: "black" }}
              >
                <span className="mark">support@curlmin.com</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
