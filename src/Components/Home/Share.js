const shareOnWhatsApp = (url) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check this out: ${url}`
  )}`;
  window.open(whatsappUrl, "_blank");
};

const shareOnFacebook = (url) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  window.open(facebookUrl, "_blank");
};

const shareOnTwitter = (url) => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check this out: ${url}`
  )}`;
  window.open(twitterUrl, "_blank");
};

const shareOnEmail = (url) => {
  const emailUrl = `mailto:?subject=Check this out!&body=Here's something I wanted to share: ${url}`;
  window.location.href = emailUrl;
};

const shareOnLinkedIn = (url) => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;
  window.open(linkedinUrl, "_blank");
};

export {
  shareOnWhatsApp,
  shareOnFacebook,
  shareOnEmail,
  shareOnLinkedIn,
  shareOnTwitter,
};
