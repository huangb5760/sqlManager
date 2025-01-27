import { useState } from "react";

import { DiffEditor } from 'plug/components';

import { useDocumentTitle } from 'plug/hooks';

import { Checkbox, FileInput, Label } from 'plug/extra/form-item/v1/form-item-v1.module';
import DriftToolbar from 'plug/extra/drift-toolbar/drift-toolbar.module';

import styles from './text-difference.module.css';

const DEFAULT_VALUE = 'Paste text here…';

export default function TextDifference() {
    useDocumentTitle('文本比较');
    const [inline, setInline] = useState(false);
    const [values, setValues] = useState([DEFAULT_VALUE, DEFAULT_VALUE]);
    return (
        <div className={styles.root}>
            <DiffEditor value={values} inline={inline} />
            <DriftToolbar>
                <Label>Load files:</Label>
                <FileInput placeholder="nothing…" multiple={true} size={2} onChange={(files) => {
                    if (!files || !Array.isArray(files) || files.length === 0) {
                        return;
                    }
                    setValues(files.map(file => `/** Load from [${file.name}] **/\n\n${file.content}`));
                }} />
                <Checkbox label="Display inline" defaultChecked={inline} onChange={value => { setInline(value) }} />
            </DriftToolbar>
        </div>
    );
}