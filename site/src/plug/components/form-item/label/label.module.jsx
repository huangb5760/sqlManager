import classNames from 'classnames';

import FormItem from '../base/form-item-base.module';

import styles from './label.module.css';

export default function Label({ className, children, inline }) {
    return (
        <FormItem className={classNames(styles.root, className)} inline={inline}>
            <label>{children}</label>
        </FormItem>
    );
}