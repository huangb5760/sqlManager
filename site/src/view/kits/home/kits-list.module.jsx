import { memo, useEffect } from 'react';

import { Outlet, useOutletContext } from "react-router-dom";

import { useDocumentTitle } from 'plug/hooks';

import TextDifference from '../text/difference/text-difference.module';

import { SQL_KITS_NAVI, SQLFormatter } from '../sql/v1/sql-kits-v1.module';

import { JSON_KITS_NAVI } from '../json/v1/json-kits-v1.module';

import styles from './kits-list.module.css';

const KitList = () => {
    return (
        <div>all kits</div>
    );
}

const KitsLayout = memo(() => {
    useDocumentTitle('所有工具');
    const { setNaviItems } = useOutletContext();
    useEffect(() => {
        setNaviItems([{
            name: 'All kits',
            path: './'
        }, {
            name: 'SQL Formatter',
            path: 'sql-formatter'
        }, {
            name: 'Text Difference',
            path: 'text-differ'
        }]);
    }, []);
    return (
        <div className={styles.root}>
            <Outlet />
        </div>
    );
});

KitsLayout.displayName = 'KitsLayout@v1';

export default {
    element: <KitsLayout />,
    children: [{
        index: true,
        element: <KitList />
    }, {
        path: 'sql-formatter',
        element: <SQLFormatter />
    }, {
        path: 'text-differ',
        element: <TextDifference />
    }, {
        path: '*',
        element: <div>no matched kit</div>
    }]
}