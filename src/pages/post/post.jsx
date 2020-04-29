import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Markdown from 'markdown-to-jsx';

import axios from 'axios';

class Post extends Component {

    state = {
        status: -1
    }

    componentDidMount() {
        const { params } = this.props.match || {};
        axios.get(`${process.env.PUBLIC_URL}/post/${params.unique}.json`)
            .then(({ statusText, data }) => {
                if (statusText === 'OK') {
                    this.setState({
                        status: 0,
                        post: data
                    })
                } else {
                    this.setState({
                        status: 1,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    status: 1,
                })
            })
    }

    render() {
        const status = this.state.status;
        if (status === -1) {
            return <div>loading</div>
        } else if (status === 0) {
            return (
                <div className="blog">
                    <article className="markdown">
                        <h2>{this.state.post.meta.title}</h2>
                        <Markdown children={this.state.post.markdown}
                            options={{
                                slugify: str => str,
                                createElement: (type, props, children) => {
                                    if (props.key === 'outer') {
                                        props.className = 'outer post';
                                    }
                                    if (type === 'pre' && children.type === 'code') {
                                        props.className = 'code-block'
                                    }
                                    return React.createElement(type, props, children);
                                },
                            }} />
                    </article>
                </div>
            )
        } else {
            return <div>error</div>
        }
    }
}

export default withRouter(Post);