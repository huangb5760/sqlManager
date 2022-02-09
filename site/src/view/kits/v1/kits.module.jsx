import { useState } from 'react';

import { useDocumentTitle } from 'plug/hooks';

import { Accordion, Splitter } from "plug/components";

import styles from './kits.module.css';

const groups = [{
    name: 'JSON 工具集',
    items: [{
        name: '格式化',
        view: <div>JSON 格式化</div>
    }]
}, {
    name: 'SQL 工具集',
    items: [{
        name: '格式化',
        view: <div>SQL 格式化</div>
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
                        <div className={styles.menu_group} key={index} title={name}>
                            {items.map((item, index) => (
                                <div className={styles.menu_item} key={index} onClick={() => setView(item.view)}>{item.name}</div>
                            ))}
                        </div>
                    ))}
                </Accordion>
                <div className={styles.board}>
                    {view}
                </div>
            </Splitter>
        </div>
    );
};