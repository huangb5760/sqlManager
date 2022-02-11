import { memo, useState } from 'react';

import { pascalCase } from "pascal-case";
import classNames from 'classnames';

import { useId } from 'plug/hooks';

import FormItem from '../base/form-item-base.module';

import styles from './form-input.module.css';

const FormInput = memo(({ className, type = 'text', name: fieldName, defaultValue, value: initValue, required, inline, pure, onChange }) => {
    const fieldId = `form-item-${useId()}`;
    const name = fieldName || `${pascalCase(type)} Field`;
    return (
        <FormItem className={classNames(styles.root, className)} inline={inline} pure={pure}>
            <input id={fieldId} defaultValue={defaultValue || initValue} type={type} placeholder={name} />
        </FormItem>
    );
});


FormInput.displayName = 'FormInput';

export default FormInput;