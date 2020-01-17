import errorHandler from "errorhandler";
import { connect } from "./database/connect.js";
import app from "./app.js";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

connect(() => {
  /**
   * Start Express server.
   */
  const server = app.listen(app.get("port"), () => {
      console.log(`[✔] App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
      console.log("[i] Press CTRL-C to stop\n");
  });
});