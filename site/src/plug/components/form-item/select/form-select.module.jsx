import React, { Children, forwardRef, useState } from "react";
import kindOf from 'kind-of';
import classNames from "classnames";

import FormItem from '../base/form-item-base.module';

import styles from './form-select.module.css';

const Select = forwardRef(({ className, children, options = [], defaultValue, inline, pure, onChange, optionRender }, ref) => {
    const [selected, setSelected] = useState(defaultValue);
    const valueChanged = (value) => {
        const converted = Children.count(children) ? value : options[value];
        setSelected(converted);
        if (kindOf(onChange) === 'function') {
            onChange(converted);
        }
    };
    return (
        <FormItem className={classNames(styles.root, className)} inline={inline} pure={pure}>
            <select defaultValue={selected} onChange={({ target }) => valueChanged(target.value)}>
                {Children.count(children) ? children : (
                    (options) ? (Array.isArray(options) ? options : Object.entries(options)).map((child, index) => {
                        return (
                            <option key={index} value={index}>
                                {kindOf(optionRender) === 'function' ? optionRender(child) : child}
                            </option>
                        );
                    }) : null
                )}
            </select>
        </FormItem>
    );
});

Select.displayName = 'Select';

export default Select;