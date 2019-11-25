#!/usr/bin/env ts-node

import * as program from "commander";
import {getClass, getMethod} from "./providers/deps";
import {PlSqlRoot, PlsqlUseCaseExternPointAnalyzor} from "./services/analyze-plsql-use-case-extern-point";
import {MySql} from "./database/my-sql-client";
import {DbClient} from "./database/db-client";

program.command("analyze")
    .option("-l, --url <dependency service root>", "dependency service root")
    .option("-v, --visual <dependency visual root>", "dependency visual root")
    .action(async (options: AnalyzeOption) => {
        const service = new PlsqlUseCaseExternPointAnalyzor();
        // const plsqls = [{"pkg": "PKG_LIFE_NEWBIZ_APPRO_INC", "method": "P_APPROVAL_INSERT_REAL_FEE"}];

        // const dbClient: DbClient = new MySql( "10.127.151.14", 8306, "root", "prisma", "default@default");
        const dbClient: DbClient = new MySql("localhost", 3306, "root", "", "test");
        let result = await dbClient.query("select * from POLICY_FEE_PROCEDURE;");

        result.map((item: any) => {
            console.log(item.clz);
        });

        await dbClient.close();
        // console.log(procedureEntities);

        // const plsqls = [];
        // const ignoreJavaMethodNames = [''];
        // const roots = await service.justDo(options.url, plsqls, ignoreJavaMethodNames);
        // const result = exportPlsqlRoot(attachToUrl(options.visual, roots));
        //
        // console.log(result);
    });

program.parse(process.argv);

class AnalyzeOption {
    public url: string;
    public visual: string;
}

export type RootWithUrl = PlSqlRoot & { visual: { plsql: string; root: string } }

function attachToUrl(visualUrl: string, plsqlRoots: PlSqlRoot[]): RootWithUrl[] {
    return plsqlRoots.map(root => {
        return {
            plsql: root.plsql,
            root: root.root,
            visual: {
                plsql: `${visualUrl}/plsql/${root.plsql.pkg}/${root.plsql.method}/callers`,
                root: root.root ?
                    `${visualUrl}/method/${getClass(root.root)}/${getMethod(root.root)}/invokes` :
                    ''
            }
        }
    });
}

