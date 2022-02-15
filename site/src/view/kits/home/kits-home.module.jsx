import { useMemo } from 'react';

import { Outlet, Link } from "react-router-dom";

import { useDocumentTitle } from 'plug/hooks';

import { Accordion, Splitter } from "plug/components";

import JSONEditor from 'view/kits/json/editor/json-editor.module';

import SQLFormatter from 'view/kits/sql/formatter/sql-formatter.module';
import DDLSchema from 'view/kits/sql/ddl-schema/ddl-schema.module';

import TimeKits from 'view/kits/text/time/time-kits.module';
import Difference from 'view/kits/text/difference/text-difference.module';

// expr
import CronExpression from 'view/kits/text/cron/cron-expression-v1.module';
import ScoopCommander from 'view/kits/text/cli/scoop/scoop-cli.module';

import styles from './kits-home.module.css';

const filterItems = (items = []) => items.filter(({ index }) => !index);

const ROUTER = {
    element: <HomeLayout />,
    children: [{
        index: true,
        element: <div>Home</div>
    }, {
        path: 'json',
        label: 'JSON',
        children: [{
            index: true,
            element: <div>JSON 工具集</div>
        }, {
            path: 'editor',
            label: 'JSON 格式化',
            element: <JSONEditor />
        }]
    }, {
        path: 'sql',
        label: 'SQL',
        children: [{
            index: true,
            element: <div>SQL 工具集</div>
        }, {
            path: 'formatter',
            label: 'MySQL DDL Schema',
            element: <DDLSchema />
        }]
    }, {
        label: 'Extra',
        children: [{
            path: 'time',
            label: '时间工具类',
            element: <TimeKits />
        }, {
            path: 'expr/corn',
            label: 'Cron 表达式',
            element: <CronExpression />
        }, {
            path: 'expr/scoop',
            label: 'Scoop 命令行',
            element: <ScoopCommander />
        }]
    }]
};

function HomeLayout() {
    useDocumentTitle('工具');
    return (
        <Splitter className={styles.root} sizes={[15, 85]} gutterSize={2} minSize={230}>
            <Accordion className={styles.menu} type="menu">
                {filterItems(ROUTER.children).map((group, key) => (
                    <ul className={styles.group} key={key} title={
                        group.path ? (
                            <Link to={group.path}>{group.label}</Link>
                        ) : (
                            <span>{group.label}</span>
                        )
                    }>
                        {filterItems(group.children).map((item, index) => (
                            <li className={styles.item} key={index}>
                                <Link to={[group.path, item.path].filter(item => item).join('/')}>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ))}
            </Accordion>
            <Outlet />
        </Splitter>
    );
};

export default ROUTER;