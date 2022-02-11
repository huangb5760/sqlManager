import { Fragment, useMemo, useRef, useState } from "react";

import kindOf from 'kind-of';
import classNames from "classnames";

import unsafeParseJSON from 'parse-json';
import stripJSONComments from 'strip-json-comments';

import { useDocumentTitle } from 'plug/hooks';

import { Button, CodeBlock, CodeEditor, JSONViewer, Select, Splitter, TextArea } from 'plug/components';

import styles from './json-editor.module.css';

const QL_TYPES = {
    jsonpath: {
        display: 'JSONPath',
        language: '$',
        descrption: '使用 JSONPath 查询数据'
    },
    mingo: {
        display: 'MongoQuery',
        language: '{}',
        descrption: ''
    },
};

export default function JSONEditor() {
    useDocumentTitle('JSON 编辑器');
    const editorInstance = useRef();
    const [source, setSource] = useState('{}');
    const [type, setType] = useState('{}');
    const [expression, setExpression] = useState('');
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
                <CodeEditor language="json" ref={editorInstance} value={source} onChange={setSource} />
            </div>
            <div className={classNames(styles.right)}>
                {(kindOf(parsed) === 'error') ? (
                    <CodeBlock className={styles.parsed} language="text" value={parsed.message} />
                ) : (
                    <Fragment>
                        <div className={styles.query_bar}>
                            <div className={styles.input}>
                                <TextArea placeholder={``} onChange={setExpression} />
                            </div>
                            <div className={styles.opeartion}>
                                <Select onChange={value => console.log(value)}>
                                    {Object.entries(QL_TYPES).map(([key, option], index) => (
                                        <option key={index} value={key}>{option.display}</option>
                                    ))}
                                </Select>
                                <Button>查询</Button>
                            </div>

                        </div>
                        <JSONViewer className={styles.parsed} name="Result" value={parsed} />
                    </Fragment>
                )}
            </div>
        </Splitter>
    );
};