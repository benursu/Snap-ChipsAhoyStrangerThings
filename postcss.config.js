export default {
  plugins: {
    autoprefixer: {}, // Automatically add vendor prefixes
    'postcss-nested': {}, // Enable CSS nesting
    cssnano: {
      preset: 'default', // Minify CSS for production
    },
    'postcss-preset-env': {
      stage: 2, // Enable modern CSS features
    },
  },
};