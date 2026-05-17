import server from './server/index.js';

const protocol = process.env.PROTOCOL;
const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running at ${protocol}://${host}:${port}`);
});
