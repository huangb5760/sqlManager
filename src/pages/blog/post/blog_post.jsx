import React, { Fragment, useEffect, useState } from 'react';

import { useParams } from "react-router-dom";

import Markdown from 'markdown-to-jsx';

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

import { blogFetched } from '../../../utils/murph_store';

import './blog_post.css';

const LANG_TYPES = {
    'lang-sh': 'Shell',
    'lang-awk': 'Awk',
    'lang-lua': 'Lua',
    'lang-java': 'Java',
    'lang-bash': 'Bash',
    'lang-shell': 'Shell',
    'lang-js': 'JavaScript',
    'lang-javascript': 'JavaScript',
    'lang-dockerfile': 'Dockerfile'
};

const Title = ({ type, children }) => {
    return React.createElement(type, { className: 'title' }, <span>{ children }</span>);
}

const H3 = (props) => (<Title type='h3' { ...props } />);
const H4 = (props) => (<Title type='h4' { ...props } />);
const H5 = (props) => (<Title type='h5' { ...props } />);
const H6 = (props) => (<Title type='h6' { ...props } />);

const Prepare = ({ children }) => {
    if(children && children.type === 'code') {
        const langType = LANG_TYPES[children.props.className] || 'Text';
        return (
            <div className="code-block">
                <pre>{ children }</pre>
                <div className="lang-type">{ langType }</div>
            </div>
        )
    }
    return (
        <div>TODO prepare block</div>
    );
};

const Paragraph = ({ children }) => {
    if(children && Array.isArray(children)) {
        if(children[0] && children[0].type === 'img') {
            return (
                <p className="image">{ children }</p>
            )
        }
    }
    return (
        <p className="paragraph">{ children }</p>
    );
};

const markdownOptions = {
    overrides: {
        h1: {
            component: H3
        },
        h2: {
            component: H3
        },
        h3: {
            component: H3
        },
        h4: {
            component: H4
        },
        h5: {
            component: H5
        },
        h6: {
            component: H6
        },
        p: {
            component: Paragraph
        },
        pre: {
            component: Prepare
        },
        div: {
            props: {
                className: 'content'
            }
        },
        table: {
            props: {
                className: 'm10',
                border: 1,
                cellSpacing: 0,
                cellPadding: 0,
            }
        },
    }
};

const highlightCodeBlock = () => {
    hljs.configure({
        tabReplace: '    ',
    });
    hljs.initHighlighting();
    document.querySelectorAll('.code-block code').forEach((block) => {
        hljs.highlightBlock(block);
    });    
};

const Post = () => {
    const { unique } = useParams();
    const [ post, setPost ] = useState({});
    useEffect(() => {
        blogFetched.then(fetched => {
            setPost(fetched.find({ filename: unique }).value());
            setTimeout(() => {
                highlightCodeBlock();
            }, 50);
        })
    }, [ unique ]);
    return (
        <Fragment>
            <article className="post">
                <h2>{ post.title || '' }</h2>
                <section>
                    <Markdown children={ post.markdown || '' } options= { markdownOptions }/>
                </section>
            </article>
        </Fragment>
    );
};

export default Post;