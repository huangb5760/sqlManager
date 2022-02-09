import { useState } from 'react';

import { useDocumentTitle } from 'plug/hooks';

import { Accordion, Splitter } from "plug/components";

import JSONEditor from 'view/kits/json/editor/json-editor.module';

import SQLFormatterV1 from 'view/kits/sql/formatter/sql-formatter.module';
import DataDefinitionSchema from 'view/kits/sql/ddl-schema/ddl-schema.module';

import styles from './kits.module.css';

const groups = [{
    name: 'JSON',
    items: [{
        name: 'JSON 格式化',
        view: <JSONEditor />
    }]
}, {
    name: 'SQL',
    items: [{
        name: 'SQL 格式化',
        view: <SQLFormatterV1 />
    }, {
        name: 'MySQL DDL Schema',
        view: <DataDefinitionSchema />
    }]
}];

export default function Kits() {
    useDocumentTitle('工具');
    const [view, setView] = useState(<div>Home</div>);
    return (
        <div className={styles.root}>
            <Splitter sizes={[15, 85]} gutterSize={2} minSize={230}>
                <Accordion className={styles.menu} type="menu">
                    {groups.map(({ name = '未命名分组', items = [] }, index) => (
                        <ul className={styles.menu_group} key={index} title={name}>
                            {items.map((item, index) => (
                                <li className={styles.menu_item} key={index} onClick={() => setView(item.view)}>{item.name}</li>
                            ))}
                        </ul>
                    ))}
                </Accordion>
                <div className={styles.board}>
                    {view}
                </div>
            </Splitter>
        </div>
    );
};