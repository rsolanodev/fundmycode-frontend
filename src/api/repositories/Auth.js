import Repository from "../Repository";

const resource = "/auth/jwt";

export default {
    token(payload) {
        return Repository.post(`${resource}/token/`, payload)
    },
    refresh(payload) {
        return Repository.post(`${resource}/refresh/`, payload)
    },
}
