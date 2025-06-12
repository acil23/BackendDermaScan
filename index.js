import Hapi from '@hapi/hapi';
import predictRoutes from './routes/predict.js';
import historyRoutes from './routes/history.js';
import usersRoutes from './routes/users.js';

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // biar bisa diakses frontend
      },
    },
  });

  server.route([...usersRoutes, ...historyRoutes]);
  server.route(predictRoutes);

  await server.start();
  console.log('🚀 Server running at:', server.info.uri);
};

init();
