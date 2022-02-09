import React, { Component, Fragment, Suspense } from 'react';

import classNames from 'classnames';

import { CodeBlock } from "plug/components";

import styles from './status.module.css';

export const Loading = ({ type, message, color }) => {
    return (
        <div className={classNames(styles.loading, styles[type])} style={{ ['--loading-color']: color }} role="status">
            <div className={styles.instance}>
                <div className={styles.dots}>
                    <i className={styles.dot}></i>
                    <i className={styles.dot}></i>
                    <i className={styles.dot}></i>
                </div>
                <div className={styles.message}>{message || '加载中…'}</div>
            </div>
        </div>
    );
};

export const Error = ({ message }) => {
    return (
        <div className={styles.error}>
            <span>{message}</span>
        </div>
    );
};

export const Dynamic = ({ children }) => {
    return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    );
};

export class ErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError({ message }) {
        return { hasError: true, error: message };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        return this.state.hasError ? (
            <Fragment>
                <h3>好像出错了！</h3>
                {this.state.error && (
                    <CodeBlock language="shell" value={this.state.error} />
                )}
            </Fragment>
        ) : (
            this.props.children
        );
    }
};