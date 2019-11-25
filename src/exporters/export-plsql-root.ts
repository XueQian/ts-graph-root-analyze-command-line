import {RootWithUrl} from "../index";

export const exportPlsqlRoot = (roots: RootWithUrl[]): string => {
    const changeSymbols = "\n";
    const headTitle = `||plsql||method||sqlUrl||${changeSymbols}`;
    const depsRoot = roots.map((root) => {
        return `|${root.plsql.pkg}|${root.plsql.method}|${root.visual.plsql}|${changeSymbols}`;
    });

    return headTitle.concat(...depsRoot);
};
