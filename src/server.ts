import * as express from "express";
import * as path from "path";

const app = express();

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
app.listen(3000, () => console.log("Example app listening on port 3000!") );
