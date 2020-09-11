import React, { Component, Fragment } from 'react';

import { Link, withRouter } from "react-router-dom";

import { get, countBy } from 'lodash';

import Markdown from 'markdown-to-jsx';

import * as matter from 'gray-matter';

import MurphIcon from 'includes/murph_icon.jsx';

import { revisePost } from 'utils/article_utils';

import { markdownOptions } from 'includes/mark_config.jsx';

import { Loading } from 'core/loading/loading.jsx';

import { executeGraphQl } from 'utils/murph_store';

import './anon_object.css';

const matterConfig = { 
    excerpt: true, 
    delims: '```',
};

class LayoutTop extends Component {

	render() {
		const { tag } = this.props;
		return (
			<div className="top">
				<div className="meta">
					<span className="label">{ tag }</span>
					<div className="children">{ this.props.children }</div>
				</div>
				<div className="operations">
					<Link to="/" className="back func">
						<MurphIcon x="home" />
					</Link>
					{/*
					<Link to="/" className="navi func">
						<MurphIcon x="prev" />
					</Link>
					<Link to="/" className="navi func">
						<MurphIcon x="next" />
					</Link>
					*/}
				</div>
			</div>
		)
	}

}

class PostLayout extends Component {

	render() {
		console.log(this.props.post);
		const { number, title } = this.props.post;
		const parsed = revisePost(this.props.post);
		return (
			<Fragment>
				<LayoutTop tag="POST">
					<div className="title">
						<span>{ title }</span>
						<Link className="suffix" to={ `/post/${number}` }>
							<MurphIcon x="link" />
						</Link>
					</div>
				</LayoutTop>
				<div className="layout mark">
					<div className="content">
						<Markdown children={ parsed.content || '' } options= { markdownOptions } />
					</div>
				</div>
			</Fragment>
		)
	}

}

class CodeLayout extends Component {

	state = {
		current: 0
	}

	showSelect(comments, current) {
		const target = comments[current] || {};
		return (
			<div className="single-select">
				<div className="current">
					<span>{ target.data.title }</span>
					<a className="suffix" href={ target.url } target="_blank" rel="noopener noreferrer">
						<MurphIcon x="link" />
					</a>
				</div>
				<div className="items">
					{ (comments || []).map((comment, index) => (
						<div key={ index } className={ `item ${current === index ? "current" : ""}` } onClick={ () => this.setState({ current: index }) }>
							<span>{ comment.data.title || '无标题代码片段' }</span>
						</div>
					))}
				</div>
			</div>
		);
	}

	render() {
		const { current } = this.state;
		const comments = (get(this.props, 'code.comments.nodes') || []).map(comment => {
			return Object.assign(comment, matter(comment.body, matterConfig));
		});
		return (
			<Fragment>
				<LayoutTop tag="CODE">
					{ this.showSelect(comments, current) }
				</LayoutTop>
				<div className="layout mark">
					<div className="code">
						<div className="content">
							<Markdown children={ comments[current].content || '' } options= { markdownOptions } />
						</div>
					</div>
				</div>
			</Fragment>
		)
	}

}

class TodoLayout extends Component {
	
	render() {
		const { title, url, body } = this.props.todo || {};
		return (
			<Fragment>
				<LayoutTop tag="TODO">
					<div className="title">
						<span>{ title }</span>
						<a className="suffix" href={ url } target="_blank" rel="noopener noreferrer">
							<MurphIcon x="link" />
						</a>
					</div>
				</LayoutTop>
				<div className="layout mark">
					<div className="content">
						<Markdown children={ body || '' } options= { markdownOptions } />
					</div>
				</div>
			</Fragment>
		)
	}

}

class AnnoLayout extends Component {
	
	render() {
		return (
			<Fragment>
				<LayoutTop tag="ANNO" title={ 'TODO' }>
					<div className="title">NOT FOUND</div>
				</LayoutTop>
				<div className="layout">
					<div className="anno">
						<span>指定的对象不存在，前去</span>
						<a href="https://github.com/MurphyL/murphyl.com/issues/new">创建新的对象</a>
					</div>
				</div>
			</Fragment>
		)
	}

}

class AnnoBoard extends Component {

	render() {
		const obj = this.props.x || {};
		const { labels = {} } = obj;
		const countLabels = countBy(labels.nodes || [], 'name');
		if(countLabels['X-TODO'] > 0) {
			return (
				<TodoLayout todo={ obj } />
			);
		}
		if(countLabels['X-POST'] > 0) {
			return (
				<PostLayout post={ obj } />
			);
		}
		if(countLabels['X-CODE'] > 0) {
			return (
				<CodeLayout code={ obj } />
			);
		}
		return (
			<AnnoLayout />
		);
	}

}

class AnonObject extends Component {

	state = {
		loading: true
	}

	componentDidMount() {
		const { number } = this.props.match.params || {};
        executeGraphQl('get_issue_detail', {
            owner: 'MurphyL',
            repo: 'murphyl.com',
            number: parseInt(number)
        }).then(resp => {
            const obj = get(resp, 'data.repository.issue');
            this.setState({ loading: false, obj });
        });
	}

	render() {
		const { obj, loading } = this.state;
		if(loading) {
			return (
				<Loading />
			);
		}
		return (
			<div id="anon-object">
				<AnnoBoard x={ obj } />
			</div>
		);
	}

};

export default withRouter(AnonObject);