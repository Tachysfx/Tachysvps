import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';  // Import the Font Awesome CSS manually
config.autoAddCss = false;  // Prevent Font Awesome from automatically adding the CSS

const FontAwesomeLoader = () => {
  return null;  // This component doesn't need to render anything
};

export default FontAwesomeLoader;