import React, { Children, forwardRef, useState } from "react";
import kindOf from 'kind-of';
import classNames from "classnames";


import common from '../common/form-item.module.css';
import styles from './form-select.module.css';

const Select = forwardRef(({ className, children, options = [], defaultValue, inline, onChange, optionRender }, ref) => {
    const [selected, setSelected] = useState(defaultValue);
    const valueChanged = (value) => {
        setSelected(value);
        if (kindOf(onChange) === 'function') {
            onChange(value);
        }
    };
    return (
        <div className={classNames(common.root, styles.root, { [styles.inline]: inline }, className)} >
            <select defaultValue={selected} onChange={e => {
                const value = e.target.value;
                if (Children.count(children)) {
                    valueChanged(value);
                } else {
                    valueChanged(options[value]);
                }
            }}>
                {Children.count(children) ? children : (
                    (options) ? (kindOf(options) === 'array' ? options : Object.entries(options)).map((child, index) => {
                        return (
                            <option key={index} value={index}>
                                {kindOf(optionRender) === 'function' ? optionRender(child) : child}
                            </option>
                        );
                    }) : null
                )}
            </select>
        </div>
    );
});

Select.displayName = 'Select';

export default Select;