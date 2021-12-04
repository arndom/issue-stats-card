const core = require('@actions/core');
const axios = require('axios');

/**
 * @param {import('axios').AxiosRequestConfig['data']} data
 * @param {import('axios').AxiosRequestConfig['headers']} headers
 */

const request = (data, headers) => {
//@ts-ignore
return axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers,
    data,
});
}

module.exports = {
    request
}