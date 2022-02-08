import { Fragment, useEffect, useMemo, useState } from "react";

import classNames from "classnames";

import { Parser } from 'sql-ddl-to-json-schema';

import { useDocumentTitle } from 'plug/hooks';

import { Accordion, CodeBlock, Splitter as SplitView, Modal, Select, CodeEditor, JSONViewer } from "plug/components";

import { Button } from 'plug/extra/form-item/v1/form-item-v1.module';
import DriftToolbar from 'plug/extra/drift-toolbar/drift-toolbar.module';

import styles from './ddl-schema.module.css';

const MYSQL_DDL_PARSER = new Parser('mysql');

const DDL_PARSER_OPTIONS = { useRef: false };

const DEMO_DDL = `
CREATE TABLE demo_table (
    id int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    status tinyint(1) DEFAULT '1' COMMENT '有效标志',
    create_time datetime DEFAULT NULL COMMENT '创建时间',
    update_time datetime DEFAULT NULL COMMENT '更新时间',
    ts timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '时间戳',
    PRIMARY KEY (id)
) COMMENT='DEMO Table';
`;

const DATA_TYPES = {
    'string': {
        datax: 'string',
        impala: 'string'
    },
    'integer': {
        datax: 'bigint',
        impala: 'bigint'
    },
};

const convertHiveWriter = (schema = {}) => {
    return {
        content: [
            {
                reader: {
                    "name": "mysqlreader",
                    "parameter": {
                        "connection": [
                            {
                                "table": [
                                    "${sync_table}"
                                ],
                                "jdbcUrl": [
                                    "${jdbc_url}?"
                                ]
                            }
                        ],
                        "username": "${jdbc_username}",
                        "password": "${jdbc_password}",
                        "splitPk": "${split_key}",
                        "column": Object.entries(schema.properties || {}).map(([column]) => column)
                    }
                },
                writer: {
                    "name": "hdfswriter",
                    "parameter": {
                        "defaultFS": "${hdfs_service}",
                        "fileType": "orc",
                        "path": "${hdfs_location}/${sync_table}",
                        "fileName": "${sync_table}",
                        "column": Object.entries(schema.properties || {}).map(([column, options], index) => ({
                            index,
                            name: column,
                            type: DATA_TYPES[options.type] ? DATA_TYPES[options.type]['datax'] : null,
                            desc: `${options.description || column} - ${options.type}${options.format ? ('/' + options.format) : ''}`
                        }))
                    }
                }
            }
        ]
    };
}

const createDatabaseDQL = ({ title, properties = {} }) => {
    const columns = Object.entries(properties).map(([column, options]) => {
        return `${column} -- ${options.description}`;
    });
    return `select ${columns.join('\n   , ')} \nfrom ${title} \n-- limit 10`;
};

const createImpalaDDL = ({ title, properties = {} }) => {
    const tableName = `${title}_of_impala`;
    const suffix = `partitioned by (dt string comment "日期分区字段") \nrow format delimited fields terminated by "\\t" \nstored as orc`;
    const columns = Object.entries(properties).map(([column, options]) => {
        return `\t${column} ${DATA_TYPES[options.type] ? DATA_TYPES[options.type]['impala'] : '/** ' + options.type + ' **/'} comment "${options.description}"`;
    });
    const refreshTable = `invalidate metadata ${tableName}`;
    return `create table if not exists ${tableName} (\n${columns.join(',\n')}\n) \n${suffix};\n\n${refreshTable};`;
};

export default function DataDefinitionSchema() {
    useDocumentTitle('DDL Schema');
    const [ddls, setDDLs] = useState(DEMO_DDL);
    const [mode, setMode] = useState(0);
    const [show, setShow] = useState(false);
    const schemas = useMemo(() => {
        return MYSQL_DDL_PARSER.feed(ddls).toJsonSchemaArray(DDL_PARSER_OPTIONS);
    }, [ddls]);
    const schema = schemas[mode];
    return (
        <Fragment>
            <SplitView sizes={[60, 40]} gutterSize={5}>
                <div className={styles.editor}>
                    <CodeEditor language="sql" value={ddls} onChange={setDDLs} />
                </div>
                <div className={classNames(styles.board)}>
                    <JSONViewer name="DDL" value={schema} />
                    <DriftToolbar postion="rb">
                        <Button onClick={() => setShow(true)}>Show schema of</Button>
                        <Select defaultValue={mode} onChange={value => { setMode(value); }}>
                            {schemas.map((schema, index) => (
                                <option key={index} value={index}>{schema.title}</option>
                            ))}
                        </Select>
                    </DriftToolbar>
                </div>
            </SplitView>
            <Modal className={styles.details} open={show} title="展示 Schema" onClose={() => setShow(false)}>
                {schema ? (
                    <Accordion show={3}>
                        <div className={styles.summary} title={`Table Summary`}>
                            <table>
                                <tr>
                                    <td>Name</td>
                                    <td>{schema.title}</td>
                                </tr>
                                <tr>
                                    <td>Comment</td>
                                    <td>{schema.description}</td>
                                </tr>
                                <tr>
                                    <td>Columns</td>
                                    <td>{Object.entries(schema.properties || {}).map(([column]) => column).join(', ')}</td>
                                </tr>
                                <tr>
                                    <td>Not Null</td>
                                    <td>{(schema.required || []).join(', ')}</td>
                                </tr>
                                <tr>
                                    <td>Columns Count</td>
                                    <td>{Object.entries(schema.properties || {}).length}</td>
                                </tr>
                            </table>
                        </div>
                        <div title="DataX / (RDBMS ➔ HDFS)">
                            <CodeBlock language="json" value={JSON.stringify(convertHiveWriter(schema), null, 3)} />
                        </div>
                        <div title="Scoop / (RDBMS ➔ Impala)">
                            <CodeBlock language="shell" value={'// TODO'} />
                        </div>
                        <div title="Impala Table DDL">
                            <CodeBlock language="sql" value={createImpalaDDL(schema)} />
                        </div>
                        <div title="RDBMS Table DQL">
                            <CodeBlock language="sql" value={createDatabaseDQL(schema)} />
                        </div>
                        <div title="JSON Schema">
                            <CodeBlock language="json" value={JSON.stringify(schema, null, 3)} />
                        </div>
                    </Accordion>
                ) : (
                    <div>Error</div>
                )}
            </Modal>
        </Fragment>
    );

}