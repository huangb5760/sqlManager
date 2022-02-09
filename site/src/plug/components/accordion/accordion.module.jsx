import { Children, useState } from "react";

import classNames from 'classnames';

import styles from './accordion.module.css';

export default function Accordion({ className, children, show, type = "component" }) {
    const [current, setCurrent] = useState(show || 0);
    return (
        <div className={classNames(styles.root, className)} data-type={type}>
            {Children.map(children, (child, index) => (
                <div key={index} className={classNames(styles.item, { [styles.expanded]: (current === index) })}>
                    <div className={styles.header} data-no={index + 1} onClick={() => { setCurrent(index) }}>
                        <span>{child.props.title || `Accordion ${index + 1}`}</span>
                    </div>
                    <div className={styles.content_wrapper}>
                        <div className={styles.details}>
                            {child}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}