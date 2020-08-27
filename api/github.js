const axios = require('axios');
const lodash = require('lodash');

const githubWebhook = 'https://api.github.com/graphql';

const githubToken = process.env.GITHUB_WEBHOOK;
const githubUser = process.env.NOW_GITHUB_ORG;
const githubRepo = process.env.NOW_GITHUB_REPO;

const githubConfig = {
	headers:{
		Authorization: `Bearer ${githubToken}`
	}
};

const QUERY_REPO = `query{ repository(owner:"${githubUser}", name:"${githubRepo}") { id } }`;

const createIssue = ({ repositoryId, title, body }) => (`mutation CreateIssuePayload { createIssue(input:{ repositoryId: "${ repositoryId }", title: "${ title }", body: "${ body }" }) { clientMutationId } }`);

const repoFetched = axios.post(githubWebhook, { query: QUERY_REPO }, githubConfig);

export default async (req, res) => {
	const { message = 'hello, murph' } = req.query;
	const result = {};
	try{
		const { data } = await repoFetched.then(({ data }) => data);
		const repositoryId = lodash.get(data, 'repository.id');
		console.log('查询到的仓库ID：', data, repositoryId);
		const params = { repositoryId, title: 'x', body: 'y' };
		const creation = await axios.post(githubWebhook, { query: createIssue(params) }, githubConfig);
		Object.assign(result, {
			code: 0,
			payload: {
				repositoryId,
				creation: lodash.get(creation, 'data.data')
			}
		});
	} catch(error) {
		Object.assign(result, {
			code: 1,
			message: '获取文章评论信息出错'
		})
	}
	res.json(result);
};