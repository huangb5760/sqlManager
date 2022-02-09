import classNames from 'classnames';
import styles from './form-item-base.module.css';

export default function FormItem({ className, children, inline, pure }) {
    return (
        <div className={classNames(styles.root, className, { [styles.inline]: inline, [styles.wrap]: !pure })}>{children}</div>
    );
}