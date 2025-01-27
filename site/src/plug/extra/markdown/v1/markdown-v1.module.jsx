import React from 'react';

import classNames from 'classnames';

import { useJSONPath } from 'plug/hooks';

import TOML from '@iarna/toml';
import * as matter from 'gray-matter';

import ReactMarkdown from 'react-markdown';

import { CodeBlock } from 'plug/components';

import styles from './markdown-v1.module.css';

// https://www.npmjs.com/package/react-markdown
const options = {
    className: styles.root,
    skipHtml: true,
    components: {
        a: ({ children, href }) => <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">{children}</a>,
        p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
        h1: ({ children }) => <h3 className={styles.title}>{children}</h3>,
        h2: ({ children }) => <h3 className={styles.title}>{children}</h3>,
        h3: ({ children }) => <h3 className={styles.title}>{children}</h3>,
        h4: ({ children }) => <h4 className={styles.title}>{children}</h4>,
        h5: ({ children }) => <h5 className={styles.title}>{children}</h5>,
        h6: ({ children }) => <h6 className={styles.title}>{children}</h6>,
        ul: ({ children }) => <ul className={classNames(styles.list)}>{children}</ul>,
        ol: ({ children }) => <ol className={classNames(styles.list)}>{children}</ol>,
        li: ({ children }) => <li className={classNames(styles.item)}>{children}</li>,
        pre: ({ children, node }) => {
            const tagName = useJSONPath(node, '$.children.0.tagName');
            if (tagName === 'code') {
                return children;
            } else {
                return (
                    <pre className={styles.prepare}>{children}</pre>
                );
            }
        },
        code: ({ inline, children, className }) => {
            if (inline) {
                return <code className={styles.code}>{children}</code>;
            } else {
                const language = className ? className.replace(/^language-/, '') : null;
                return (
                    <CodeBlock language={language} value={children.join('\n').trim()} />
                );
            }
        },
        blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>
    }
};

export const MarkdownViewer = ({ value }) => <ReactMarkdown children={value} {...options} />;

export const parseMarkdown = (data = '') => {
    const { data: meta, excerpt, content } = matter(data, {
        excerpt: true,
        language: 'toml',
        delims: ['```', '```'],
        excerpt_separator: '<!-- more -->',
        engines: {
            toml: {
                parse: (source) => TOML.parse(source),
                stringify: () => {
                    throw new Error('cannot stringify to TOML');
                }
            },
        }

    });
    return { ...meta, excerpt, content };
};
