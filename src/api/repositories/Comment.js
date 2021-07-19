import Repository from "../Repository";

const resource = "/comments";

export default {
    getByPost(post) {
        return Repository.get(`${resource}/?post=${post}`)
    },
    createComment(payload) {
        return Repository.post(`${resource}/`, payload);
    },
}
