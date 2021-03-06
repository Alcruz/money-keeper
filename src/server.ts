import * as express from "express";
import * as path from "path";

const port = 3000;
const app = express();

const staticRoot = path.join(__dirname, "/public/");
app.use(express.static(staticRoot));

app.get("/", (req, res) => {
    const template = require("./views/index.pug");
    const data = {
        title: "Money Keeper",
        description: "Saving all your money",
    };

    res.status(200);
    res.send(template(data));
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`The server is running at http://localhost:${port}/`) );
