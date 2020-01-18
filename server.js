const errorhandler = require('errorhandler');
const { connect } = require("./database/connect.js");

/**
 * Error Handler. Provides full stack - remove for production
 */

connect(() => {
    const app = require("./app.js");
    app.use(errorhandler());
    /**
     * Start Express server.
     */
    const server = app.listen(app.get("port"), () => {
        console.log(`[✔] App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
        console.log("[i] Press CTRL-C to stop\n");
    });
});