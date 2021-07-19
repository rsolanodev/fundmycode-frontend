import Repository from "../Repository";

const resource = "/posts";

export default {
    filter(payload) {
        return Repository.get(`${resource}/?user=${payload.user}`)
    },
    delete(pk) {
        return Repository.delete(`${resource}/${pk}/`);
    },
    createPost(payload) {
        return Repository.post(`${resource}/`, payload);
    },
    getPost(pk) {
        return Repository.get(`${resource}/${pk}/`);
    },
    updatePost(payload, pk) {
        return Repository.patch(`${resource}/${pk}/`, payload);
    },
    getFeed() {
        return Repository.get(`${resource}/?following=True`);
    },
    getFeedPage(page) {
        return Repository.get(`${resource}/?page=${page}&following=True`)
    },
    getFeedOnlySupporting() {
        return Repository.get(`${resource}/?supporting=True`);
    }
}
