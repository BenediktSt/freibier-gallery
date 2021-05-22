const config = require('./config');

module.exports = {
  pathPrefix: config.pathPrefix,
  siteMetadata: {
    title: config.siteTitle,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.manifestName,
        short_name: config.manifestShortName,
        start_url: config.pathPrefix || config.manifestStartUrl,
        background_color: config.manifestBackgroundColor,
        theme_color: config.manifestThemeColor,
        display: config.manifestDisplay,
        icon: config.manifestIcon, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyBUcBj5mu7bg41b3Ju0TDIYA1soaZKkIh4",
          authDomain: "freibiergesichter-gallery.firebaseapp.com",
          projectId: "freibiergesichter-gallery",
          storageBucket: "freibiergesichter-gallery.appspot.com",
          messagingSenderId: "18107402466",
          appId: "1:18107402466:web:fcc6ff0ffb04121e5ab6bb"
        }
      }
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
  ],
};
