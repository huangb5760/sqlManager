
import { useDocumentTitle } from 'plug/hooks';

import { Accordion, Splitter, Tree } from "plug/components";

import styles from './kits.module.css';

const items = [{ 
    id: 'sql', 
    name: 'SQL 工具集'
}, {
    id: 'text', 
    name: '表达式'
}, {
    id: 'time', 
    name: '时间'
}];

export default function Kits() {
    useDocumentTitle('工具');
    return (
        <div className={styles.root}>
            <Splitter sizes={[15, 85]} gutterSize={2} minSize={230}>
                <Accordion type="menu">
                    <div title="JSON">hello</div>
                    <div title="SQL">world</div>
                </Accordion>
                <div>2</div>
            </Splitter>
        </div>
    );
};