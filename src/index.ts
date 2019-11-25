#!/usr/bin/env ts-node

import * as program from "commander";
import {Deps, getClass, getMethod, PlsqlName} from "./providers/deps";
import {PlSqlRoot, PlsqlUseCaseExternPointAnalyzor} from "./services/analyze-plsql-use-case-extern-point";
import {MySql} from "./database/my-sql-client";
import {DbClient} from "./database/db-client";
import {exportPlsqlRoot} from "./exporters/export-plsql-root";

program.command("analyze")
    .option("-l, --url <dependency service root>", "dependency service root")
    .option("-v, --visual <dependency visual root>", "dependency visual root")
    .action(async (options: AnalyzeOption) => {
        const service = new PlsqlUseCaseExternPointAnalyzor();
        // const plsqls = [{"pkg": "PKG_LIFE_NEWBIZ_APPRO_INC", "method": "P_APPROVAL_INSERT_REAL_FEE"}];
        // const dbClient: DbClient = new MySql( "10.127.151.14", 8306, "root", "prisma", "default@default");
        const dbClient: DbClient = new MySql("localhost", 3306, "root", "", "test");
        let dbResult = await dbClient.query("select * from POLICY_FEE_PROCEDURE;");

        const plsqls = [];
        dbResult.map((item: any) => {
            const plsqlName = new PlsqlName(item.clz, item.method);
            plsqls.push(plsqlName);
        });
        await dbClient.close();
        const roots = await service.justDo(options.url, plsqls);
        console.log(roots);
        console.log(roots.length);
        const roots1 = attachToUrl(options.visual, roots);
        const result = exportPlsqlRoot(roots1);
        console.log(result);
    });

program.parse(process.argv);

class AnalyzeOption {
    public url: string;
    public visual: string;
}

export type RootWithUrl = PlSqlRoot & { visual: { plsql: string; } }

function attachToUrl(visualUrl: string, deps: Deps[]): RootWithUrl[] {
    return deps.map(dep => {
        if (dep && dep.plSql) {
            return {
                plsql: dep.plSql,
                visual: {
                    plsql: `${visualUrl}/plsql/${dep.plSql.pkg}/${dep.plSql.method}/callers`
                }
            }
        }
    });
}

