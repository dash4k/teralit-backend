import morgan from 'morgan';

morgan.token('flask-time', () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').replace('Z', '').replace('.', ',');
});

morgan.token('apache-time', () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'short' });
  const year = now.getFullYear();
  const time = now.toTimeString().split(' ')[0];
  return `${day}/${month}/${year} ${time}`;
});

const format =
  ':flask-time [INFO] :remote-addr - - [:apache-time] ":method :url HTTP/:http-version" :status -';

export default morgan(format);
