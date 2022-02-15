import classNames from 'classnames';

import FormItem from '../base/form-item-base.module';

import styles from './textarea.module.css';

export default function TextArea({ className, inline, onChange }) {
    const valueChanged = (value) => {
        if (typeof onChange === 'function') {
            onChange(value);
        }
    };
    return (
        <FormItem className={classNames(styles.root, className)} inline={inline}>
            <textarea rows="2" onChange={({ target }) => valueChanged(target.value)} />
        </FormItem>
    );
}