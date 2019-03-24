console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
  id: process.env.BANDSINTOWN_ID,
  secret: process.env.BANDSINTOWN_SECRET
};
