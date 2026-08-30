const axios = require('axios');

async function main() {
  try {
    const response = await axios.get('https://api.github.com/users/torvalds/events', {
      params: { page: 1, per_page: 5 },
    });
    console.log(JSON.stringify(response.data[0], null, 2));
  } catch (err) {
    console.error(err);
  }
}
main();
