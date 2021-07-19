import Repository from "../Repository";

const resource = "/developers";

export default {
    me() {
        return Repository.get(`${resource}/me/`)
    },
    getDeveloper(url) {
        return Repository.get(`${resource}/?url=${url}`)
    },
    search(query) {
        return Repository.get(`${resource}/?search=${query}`)
    },
    updateDeveloper(payload) {
        return Repository.patch(`${resource}/me/`, payload);
    },
    follow(pk) {
        return Repository.post(`${resource}/${pk}/follow/`);
    },
    unfollow(pk) {
        return Repository.post(`${resource}/${pk}/unfollow/`);
    },
    getPage(page, filters) {
        return Repository.get(`${resource}/?page=${page}${filters}`)
    },
}
