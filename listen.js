const app = require('./app');

console.log(">>>>>>>>>>>IN LISTENING<<<<<<<<<<<<<<<<<,")

// Clever Cloud provides the PORT environment variable
const port = process.env.PORT || 9090;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});