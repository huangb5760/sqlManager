import { useState } from 'react';
import dayjs from 'dayjs';
import kindOf from 'kind-of';

import classNames from 'classnames';

import { useDocumentTitle } from 'plug/hooks';

import { Accordion, FormInput, Select } from 'plug/components';

import styles from './time-kits.module.css';

const PATTERNS = {
    DATE: [{
        label: 'Year',
        value: {
            Dayjs: 'YYYY',
            Java: 'yyyy'
        },
    }, {
        label: 'Separator',
        value: '-',
    }, {
        label: 'Month',
        value: {
            Dayjs: 'MM',
            Java: 'MM'
        },
    }, {
        label: 'Separator',
        value: '-',
    }, {
        label: 'Date',
        value: {
            Dayjs: 'DD',
            Java: 'dd'
        },
    }],
    TIME: [{
        label: 'Hour',
        value: {
            Dayjs: 'HH',
            Java: 'HH'
        },
    }, {
        label: 'Separator',
        value: ':',
    }, {
        label: 'Minute',
        value: {
            Dayjs: 'mm',
            Java: 'mm'
        },
    }, {
        label: 'Separator',
        value: ':',
    }, {
        label: 'Second',
        value: {
            Dayjs: 'ss',
            Java: 'ss'
        },
    }, {
        label: 'Separator',
        value: '.',
    }, {
        label: 'Millisecond',
        value: {
            Dayjs: 'SSS',
            Java: 'SSS'
        },
    }],
    SPECIAL: [{
        label: 'Meridiem',
        value: {
            Dayjs: 'A',
            Java: '?'
        },
        label: 'Timezone',
        value: {
            Dayjs: 'Z',
            Java: '?'
        },
    }]
};

const GROUPS = [['Year/Month/Date', 'DATE'], ['Hour/Minute/Second', 'TIME']];

export default function TimeKits() {
    useDocumentTitle('时间工具');
    const [pattern, setPattern] = useState('Java');
    const [datetime, setDatetime] = useState(dayjs());
    return (
        <div className={classNames(styles.root)}>
            <div>
                <div>
                    <FormInput name="DateTime" required value={datetime.format('YYYY-MM-DD')} onChange={value => setDatetime(dayjs(value))} />
                </div>
                <div>
                    <FormInput name="Unix Timestamp" value={datetime.unix()} />
                </div>
            </div>
            <Accordion>
                <div title="Pattern">
                    {GROUPS.map(([groupLabel, groupName], index) => (
                        <fieldset key={index}>
                            <legend>{groupLabel}</legend>
                            {PATTERNS[groupName].map(({ label, value }, index) => (
                                <FormInput key={index} inline name={label} value={kindOf(value) === 'string' ? value : value[pattern]} />
                            ))}
                        </fieldset>
                    ))}
                </div>
                <div title="Calculate">
                    {GROUPS.map(([groupLabel, groupName]) => (
                        PATTERNS[groupName].filter(({ value }) => kindOf(value) === 'object').map(({ label, value }, index) => (
                            <div key={index}>
                                <FormInput inline name={label} value={value} data-group={groupLabel} />
                                <FormInput inline type="number" name={`Add x ${label.toLowerCase()}`} value={0} data-group={groupLabel} />
                            </div>
                        ))
                    ))}
                </div>
                <div title="Presets">
                    <Select inline>
                        <option value="Java">Java</option>
                        <option value="MySQL">MySQL</option>
                    </Select>
                </div>
            </Accordion>
        </div>
    );
}