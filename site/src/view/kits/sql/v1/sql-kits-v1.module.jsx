import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import classNames from "classnames";
import { useDocumentTitle } from 'plug/hooks';
import { format as formatSQL } from '@sqltools/formatter';

import DriftToolbar from 'plug/extra/drift-toolbar/drift-toolbar.module';

import { Dynamic } from 'plug/extra/status/status.module';
import { CodeEditor } from 'plug/components';
import { Button, Label, Select as SelectV1 } from 'plug/extra/form-item/v1/form-item-v1.module';

import IssueSchema from "plug/github/issue/issue-schema/issue-schema.module";

import DataDefinitionSchema from '../ddl-schema/ddl-schema.module';

import styles from './sql-kits-v1.module.css';

export const SQLFormatter = () => {
    useDocumentTitle('SQL 格式化');
    const [sql, setSQL] = useState('select 1 from dual');
    const [wordCase, setWordCase] = useState('null');
    const format = () => {
        setSQL(formatSQL(sql, {
            language: 'language',
            indent: '    ',
            reservedWordCase: wordCase,
            linesBetweenQueries: 3,
        }));
    };
    return (
        <div className={styles.editor}>
            <CodeEditor language="sql" value={sql} onChange={setSQL} />
            <DriftToolbar>
                <Button onClick={format}>Beautify</Button>
                <Label>Convert keywords to</Label>
                <SelectV1 onChange={setWordCase}>
                    <option value="null">Preserve</option>
                    <option value="upper">UpperCase</option>
                    <option value="lower">LowerCase</option>
                </SelectV1>
            </DriftToolbar>
        </div>
    );
};

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
        element: <SQLFormatter />
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