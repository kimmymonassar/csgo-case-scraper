const { config } = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  config({ path: path.resolve(process.cwd(), '.env') });
} else {
  config({ path: path.resolve(process.cwd(), '.env.development') });
}
