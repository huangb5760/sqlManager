import { useState } from "react";

import { useDocumentTitle } from 'plug/hooks';
import { format as formatSQL } from '@sqltools/formatter';

import { CodeEditor } from 'plug/components';
import { Button, Label, Select } from "plug/components";
import DriftToolbar from 'plug/extra/drift-toolbar/drift-toolbar.module';

import styles from './sql-formatter.module.css';

const formatSQLV1 = (sql, reservedWordCase) => {
    return formatSQL(sql, {
        reservedWordCase,
        language: 'language',
        indent: '    ',
        linesBetweenQueries: 3,
    });
};

export default function SQLFormatter({ value, onChange = () => null }) {
    useDocumentTitle('SQL 格式化');
    const [sql, setSQL] = useState(value || 'select 1 from dual');
    const [wordCase, setWordCase] = useState('null');
    const format = () => {
        setSQL(formatSQLV1(sql, wordCase));
        typeof (onChange) && onChange(sql);
    };
    return (
        <div className={styles.root}>
            <CodeEditor language="sql" value={sql} onChange={setSQL} />
            <DriftToolbar>
                <Button inline onClick={format}>Beautify</Button>
                <Label inline>Convert keywords to</Label>
                <Select inline defaultValue={wordCase} onChange={setWordCase}>
                    <option value="null">Preserve</option>
                    <option value="lower">LowerCase</option>
                    <option value="upper">UpperCase</option>
                </Select>
            </DriftToolbar>
        </div>
    );
}