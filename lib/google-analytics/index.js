export const pageview = (url) => {
  window.gtag("config", process.env.GA_TRACKING_ID, {
    path_url: url,
  });
};
