import classNames from 'classnames';

import styles from './form-item-base.module.css';

export default function FormItem({ className, children, inline }) {
    return (
        <div className={classNames(styles.root, className, { [styles.inline]: inline })}>{children}</div>
    );
}

export const valueChanger = (value, onChange) => {
    if (typeof onChange === 'function') {
        onChange.call(value);
    }
};