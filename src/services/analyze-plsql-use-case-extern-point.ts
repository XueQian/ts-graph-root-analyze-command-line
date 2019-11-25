import {Deps, Node, PlsqlName} from "../providers/deps";
import * as _ from "lodash";

class PlsqlUseCaseExternPointAnalyzor {

    public async justDo(ServerUrl: string, plsqls: PlsqlName[]): Promise<Deps[]> {
        const adjustPlSqls = _.uniqBy(plsqls, (item) => item.toString());
        const deps = await Deps.fetchOfSqls(ServerUrl, adjustPlSqls);
        return deps.filter(n => n);
    }

}

export type PlSqlRoot = { root?: Node } & { plsql: PlsqlName };

export {PlsqlUseCaseExternPointAnalyzor};
