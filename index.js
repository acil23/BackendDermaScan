import Hapi from '@hapi/hapi';
import predictRoutes from './routes/predict.js';
import historyRoutes from './routes/history.js';
import usersRoutes from './routes/users.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: "0.0.0.0", // penting untuk Railway!
    routes: {
      cors: {
        origin: ["*"], // masih OK untuk testing, bisa diatur nanti
      },
    },
  });

  await server.register(require('@hapi/inert'));
  server.route([...usersRoutes, ...historyRoutes]);
  server.route(predictRoutes);

  await server.start();
  console.log('🚀 Server running at:', server.info.uri);
};

init();