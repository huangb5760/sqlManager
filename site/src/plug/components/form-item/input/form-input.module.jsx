import { memo, useMemo } from 'react';

import classNames from 'classnames';
import { pascalCase } from "pascal-case";

import { useId } from 'plug/hooks';

import FormItem, { valueChanger } from '../base/form-item-base.module';

import styles from './form-input.module.css';



const FormInput = memo(({ className, type = 'text', name: fieldName, defaultValue, value: initValue, required, inline, pure, onChange }) => {
    const fieldId = `form-item-${useId()}`;
    const value = useMemo(() => defaultValue || initValue, []);
    const name = useMemo(() => (fieldName || `${pascalCase(type)} Field`), [fieldName]);
    return (
        <FormItem className={classNames(styles.root, className)} inline={inline} pure={pure}>
            <input id={fieldId} defaultValue={value} type={type} placeholder={name} onChange={({ target }) => valueChanger(target.value, onChange)} />
        </FormItem>
    );
});


FormInput.displayName = 'FormInput';

export default FormInput;