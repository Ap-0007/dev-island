const axios = require('axios');

async function main() {
  try {
    const response = await axios.get('https://api.github.com/users/torvalds/events', {
      params: { page: 1, per_page: 5 },
    });
    console.log("event types:");
    console.log(response.data.map(e => e.type));
    console.log("first push event:");
    const pushEvent = response.data.find(e => e.type === "PushEvent");
    if (pushEvent) {
      console.log(JSON.stringify(pushEvent, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
}
main();
