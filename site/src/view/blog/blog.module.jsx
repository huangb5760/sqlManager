import React, {Suspense} from 'react';
import { Helmet } from 'react-helmet-async';
import { selectorFamily, useRecoilValue } from 'recoil';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Loading } from 'plug/include/status/status.module.jsx';
import SiteLayout from "plug/template/site-layout/site-layout.module.jsx";

import styles from './blog.module.css';

const blogQuery = selectorFamily({
    key: 'blog',
    get: () => () => axios.post('https://api.github.com/graphql', {

    }, {
        headers: {
            Authorization: `bearer ${process.env.REACT_APP_GHP_TOKEN}`
        }
    })
});

export function BlogPost({ post }) {
    return (
        <SiteLayout>
            <Helmet>
                <title>{post.title} - 博客 - {process.env.REACT_APP_TITLE}</title>
            </Helmet>
            <dt>
                <a href={`/post/${post.filename}`}>
                    <h2>{post.title}</h2>
                </a>
            </dt>
            <dd>
                <article className={`summary ${post.kind}`}>
                    <Markdown children={post.summary} options={{
                        createElement: (type, props, children) => {
                            if (props.key === 'outer') {
                                props.className = 'outer markdown';
                            }
                            return React.createElement(type, props, children);
                        },
                    }} />
                </article>
            </dd>
        </SiteLayout>
    );
};


function BlogList() {
    const blog = useRecoilValue(blogQuery());
    console.log(blog);
    return (
        <SiteLayout>
            <Helmet>
                <title>博客 - {process.env.REACT_APP_TITLE}</title>
            </Helmet>
            <div className={styles.root}>Blog</div>
        </SiteLayout>
    );
};

export default function Blog() {
    return (
        <Suspense fallback={<Loading />}>
            <BlogList />
        </Suspense>
    );
}
