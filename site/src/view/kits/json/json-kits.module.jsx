import React, { Fragment } from "react";

import { ToastContainer, toast } from 'react-toast'
import classNames from "classnames";

import CodeEditor from "plug/extra/code-editor";

import { NaviTabs } from "plug/dynamic/tabs/dynamic-tabs.module";

import styles from './json-kits.module.css';

/**
 * - https://jsonlint.com/
 * - https://www.npmjs.com/package/flat
 * - https://www.npmjs.com/package/ajv
 * - https://www.npmjs.com/package/parse-json
 * - https://jsonformatter.curiousconcept.com/
 */

const validate = (rows) => {
    toast.hideAll();
    rows.forEach(({ message, startLineNumber, endLineNumber }) => {
        toast.error(`Line ${Array.from(new Set([startLineNumber, endLineNumber])).join('-')}: ${message}`)
    });
};

export default function JSONKits() {
    const editor = <CodeEditor language="json" onValidate={validate} />;
    return (
        <Fragment>
            <NaviTabs logo={'Hello'}>
                <div className={styles.json_editor} name="JSON 编辑器">
                    {editor}
                </div>
                <div className={classNames(styles.json_editor)} name="JSON 转 CSV">
                    {editor}
                </div>
            </NaviTabs>
            <ToastContainer position="bottom-left" />
        </Fragment>
    );
}