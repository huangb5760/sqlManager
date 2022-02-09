import { useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import { useDocumentTitle } from 'plug/hooks';

import { Dynamic } from 'plug/extra/status/status.module';
import IssueSchema from "plug/github/issue/issue-schema/issue-schema.module";

import SQLFormatterV1 from 'view/kits/sql/formatter/sql-formatter.module';
import DataDefinitionSchema from '../ddl-schema/ddl-schema.module';

const SQLSnippet = () => {
    useDocumentTitle('SQL 代码片段');
    return (
        <Dynamic>
            <IssueSchema label="X-SQL" unique="snippet" />
        </Dynamic>
    );
};

const SQLManual = () => {
    useDocumentTitle('SQL 帮助文档');
    return (
        <Dynamic>
            <IssueSchema label="X-SQL" unique="manual" />
        </Dynamic>
    );
};

const PATHNAME_PREFIX = 'sql/v1';

export const SQL_KITS_NAVI = [{
    path: `./${PATHNAME_PREFIX}/`,
    name: 'SQL Formatter',
}, {
    path: `./${PATHNAME_PREFIX}/ddl/schema`,
    name: 'DDL Schema',
}, {
    path: `./${PATHNAME_PREFIX}/snippet`,
    name: 'SQL Snippet',
}, {
    path: `./${PATHNAME_PREFIX}/manual`,
    name: 'SQL Manual',
}];

const SQLKitsLayout = () => {
    const { setNaviItems } = useOutletContext();
    useEffect(() => {
        setNaviItems(SQL_KITS_NAVI);
    }, []);
    return (
        <Outlet />
    );
};

SQLKitsLayout.displayName = 'SQLKits.Layout@v1';

export default {
    path: PATHNAME_PREFIX,
    element: <SQLKitsLayout />,
    children: [{
        index: true,
        element: <SQLFormatterV1 />
    }, {
        path: 'formatter',
        element: <SQLFormatterV1 />
    }, {
        path: 'ddl/schema',
        element: <DataDefinitionSchema />
    }, {
        path: 'snippet',
        element: <SQLSnippet />
    }, {
        path: 'manual',
        element: <SQLManual />
    }]
};