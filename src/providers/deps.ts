import * as rm from "typed-rest-client/RestClient";

export class Deps {

    static async fetchOfSqls(ServerUrl: string, plsqlNames: PlsqlName[]) {
        return Promise.all(
            plsqlNames.map(
                (plSqlName) => this.fetchSql(ServerUrl, plSqlName)));
    }

    public static async fetchSql(ServerUrl: string, plsqlName) {
        const client = new rm.RestClient("aop", ServerUrl);
        const url = `/plsql/${plsqlName.pkg}/${plsqlName.method}/callers`;
        try {
            const rs = await client.get<Graph>(url);

            const nodes = rs.result.nodes;
            let isClaimModule = false;
            nodes.map((node: any) => {
                if (node.properties.color === "#ADD8E6") {
                    isClaimModule = true;
                    return;
                }
            });

            if (isClaimModule && rs.statusCode === 200) {
                console.log(url);
                console.log(plsqlName);
                return new Deps(true, rs.result, plsqlName);
            }
        } catch (ex) {
        }
    }

    public readonly isSuccess: boolean;
    public readonly Deps: Graph;
    public readonly plSql: PlsqlName;

    constructor(isSuccess: boolean, Deps: Graph, plsqlName: PlsqlName) {
        this.isSuccess = isSuccess;
        this.Deps = Deps;
        this.plSql = plsqlName;
    }
}

export class PlsqlName {
    public readonly pkg: string;
    public readonly method: string;

    constructor(pkg: string, method: string) {
        this.pkg = pkg;
        this.method = method;
    }

    public toString() {
        return `${this.pkg}.${this.method}`;
    }
}

export class Graph {
    nodes: Node[];
    edges: Edge[];


    constructor(nodes: Node[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }
}

export interface Edge {
    a: string;
    b: string;
}


export const getClass: (node: Node) => string = (node: Node) => {
    return node.title.split('.').filter((element, index, array) => {
        return array.length !== index + 1;
    }).join('.')
};

export const getMethod = (node: Node) => {
    const strings = node.title.split('.');
    return strings[strings.length - 1];
};


export interface Node {
    id: string;
    title: string;
    properties: object;
}
