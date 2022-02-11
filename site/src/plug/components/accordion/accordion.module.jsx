import { Children, Fragment, useState } from "react";

import classNames from 'classnames';

import styles from './accordion.module.css';

export default function Accordion({ className, children, show, type = "component" }) {
    const [current, setCurrent] = useState(show || 0);
    return (
        <div className={classNames(styles.root, className)} data-type={type}>
            {Children.map(children, (child, index) => (
                <div key={index} className={classNames(styles.item, { [styles.expanded]: (current === index) })}>
                    <div className={styles.header} data-no={index + 1} onClick={() => { setCurrent(index) }}>
                        <Fragment>{child.props.title || `Accordion ${index + 1}`}</Fragment>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.details}>
                            {child}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}