import Hapi from "@hapi/hapi";
import predictRoutes from "./routes/predict.js";
import historyRoutes from "./routes/history.js";
import usersRoutes from "./routes/users.js";
import inert from "@hapi/inert";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
        additionalHeaders: [
          "content-type",
          "cache-control",
          "x-requested-with",
        ],
        additionalExposedHeaders: ["Accept", "Content-Type", "Authorization"],
      },
    },
  });

  await server.register(inert);

  server.route([
    ...usersRoutes,
    ...historyRoutes,
    ...predictRoutes, // <- gabung semua ke dalam satu route array
  ]);

  server.route({
    method: "OPTIONS",
    path: "/{any*}",
    handler: (request, h) => {
      return h.response().code(200);
    },
  });

  await server.start();
  console.log("🚀 Server running at:", server.info.uri);
};

init();
