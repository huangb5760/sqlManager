import { Fragment, useMemo, useRef, useState } from "react";

import kindOf from 'kind-of';
import classNames from "classnames";
import doCopy from 'copy-to-clipboard';

import unsafeParseJSON from 'parse-json';
import stripJSONComments from 'strip-json-comments';

import toast from 'react-hot-toast';

import { useDocumentTitle } from 'plug/hooks';

import { CodeBlock, CodeEditor, FormInput, JSONViewer, Select, Splitter } from 'plug/components';

import styles from './json-editor.module.css';

export default function JSONEditor() {
    useDocumentTitle('JSON 编辑器');
    const editorInstance = useRef();
    const [source, setSource] = useState('{}');
    const parsed = useMemo(() => {
        try {
            const value = unsafeParseJSON(stripJSONComments(source));
            if (kindOf(value) === 'object' || kindOf(value) === 'array') {
                return value;
            } else {
                return { [NOT_JSON_VALUE_KEY]: value };
            }
        } catch (e) {
            return e;
        }
    }, [source]);
    return (
        <Splitter className={styles.root} sizes={[55, 45]} minSize={[600, 400]}>
            <div className={styles.left}>
                <CodeEditor className={styles.editor} language="json" ref={editorInstance} value={source} onChange={setSource} />
            </div>
            <div className={classNames(styles.right)}>
                {(kindOf(parsed) === 'error') ? (
                    <CodeBlock className={styles.parsed} language="text" value={parsed.message} />
                ) : (
                    <Fragment>
                        <div className={styles.query_bar}>
                            <Select inline>
                                <option value="jsonpath">JSONPath</option>
                                <option value="mingo">MongoQuery</option>
                            </Select>
                            <FormInput inline pure />
                        </div>
                        <JSONViewer className={styles.parsed} name="JSON" value={parsed} />
                    </Fragment>
                )}
            </div>
        </Splitter>
    );
};