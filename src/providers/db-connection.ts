import {createConnection} from "typeorm";
import {PlSqlEntity} from "../entity/pl-sql-entity";

createConnection({
    type: "oracle",
    host: "10.127.151.14",
    port: 8306,
    username: "root",
    password: "prisma",
    database: "default@default",
    entities: [
        __dirname + "/entity/*.js"
    ],
    synchronize: true,
}).then(connection => {
    connection.manager.find(PlSqlEntity);
}).catch(error => console.log(error));

