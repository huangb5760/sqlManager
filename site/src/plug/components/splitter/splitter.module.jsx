import React, { Children } from "react";

import classNames from 'classnames';
import Split from 'react-split';

import styles from './splitter.module.css';

export default function Splitter({ className, children, type = 'horizontal', ...extra }) {
    return (
        <Split className={classNames(styles.root, styles[type], className)} data-element="split-view" gutterSize={5} direction={type} {...extra}>
            {(Children.count(children) > 0) ? (Children.map(children, (child, index) => (
                <div className={styles.item} key={index}>{child}</div>
            ))) : (
                <div className={styles.item}>No elements here!</div>
            )}
        </Split>
    )
};