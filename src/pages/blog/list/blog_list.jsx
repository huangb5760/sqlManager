import React, { Component } from 'react';

import { Link, withRouter } from "react-router-dom";

import lodashGet from 'lodash/get';

import Markdown from 'markdown-to-jsx';

import { Loading } from 'core/loading/loading';

import { revisePost } from 'utils/article_utils';

import { fetchBlogItems } from 'utils/murph_store';

import MurphProcess from 'includes/murph_process.jsx';

import IssueReactions from 'includes/issue_reactions/issue_reactions.jsx';

import './blog_list.css';

const BlogPost = ({ post }) => {
    const { title, number, reactionGroups } = post;
    const parsed = revisePost(post);
    if(!parsed) {
        return (
            <div>解析出错的文章</div>
        );
    }
    const linkInfo = {
        pathname: number ? `/post/${number}` : '/404', 
        state: Object.assign(revisePost(post), { reactionGroups })
    };
    return (
        <div className="post">
            <dt>
                <div className="title">
                    <Link to={ linkInfo }>
                        <h2>{ title }</h2>
                    </Link>
                </div>
                <div className="reaction">
                    <IssueReactions group={ reactionGroups } />
                </div>
            </dt>
            <dd>
                <article className="summary">
                    <Markdown children={ parsed.excerpt } options={{
                        createElement: (type, props, children) => {
                            if (props.key === 'outer') {
                                props.className = 'outer markdown';
                            }
                            return React.createElement(type, props, children);
                        },
                    }} />
                </article>
            </dd>
        </div>
    )
};

const GITHUB_ISSUES_PATH = 'data.repository.issues';

class BlogList extends Component {

    state = {
        loading: true,
        size: 5,
    }

    componentDidMount() {
        const { size } = this.state;
        this.fetchPost({
            type: 'X-POST',
            direction: 'before', 
            fetch: 'first',
            size,
        });
    }

    fetchPost(params) {
        MurphProcess.start();
        fetchBlogItems(params).then((resp) => {
            const x = lodashGet(resp, GITHUB_ISSUES_PATH);
            const { nodes, pageInfo, totalCount } = x;
            this.setState({
                loading: false,
                pageInfo, 
                totalCount,
                posts: nodes
            });
        }).catch(error => {
            console.error('查询数据出错：', error);
        }).finally(() => {
            MurphProcess.end();
            console.log('文章列表数据查询完成');
        })
    }

    changePage(direction, cursor) {
        this.setState({ loading: true });
        const { size } = this.state;
        const fetch = direction === 'before' ? 'last' : 'first';
        this.fetchPost({
            type: 'X-POST',
            direction,
            cursor,
            fetch,
            size
        });
    }

    render() {
        const { loading, posts, pageInfo, totalCount } = this.state;
        if(loading) {
            return (
                <Loading message="数据加载中" />
            );
        }
        const { endCursor, startCursor } = pageInfo;
        const go = this.changePage.bind(this);
        return (
            <div id="blog-list">
                <dl className="blog">
                    {(posts || []).map((post, index) => (
                        <BlogPost key={ index } post={ post } />
                    ))}
                </dl>
                <div className="pager">
                    <div className="pager-navi prev">
                        { pageInfo.hasPreviousPage && ( 
                            <Link to="#" onClick={ () => go('before', startCursor) }>较新的文章</Link>
                        )}
                    </div>
                    <div className="pager-navi desc">共{ totalCount }篇文章</div>
                    <div className="pager-navi next">
                        { pageInfo.hasNextPage && ( 
                            <Link to="#" onClick={ () => go('after', endCursor) }>更早的文章</Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

};

export default withRouter(BlogList);
