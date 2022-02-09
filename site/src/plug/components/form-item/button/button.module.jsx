import classNames from 'classnames';

import FormItem from '../base/form-item-base.module';

import styles from './button.module.css';

export default function Button({ className, children, inline, pure, onClick }) {
    return (
        <FormItem className={classNames(styles.root, className)} inline={inline} pure={pure}>
            <button onClick={onClick}>{children}</button>
        </FormItem>
    );
}