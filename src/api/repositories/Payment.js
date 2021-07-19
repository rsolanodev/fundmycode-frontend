import Repository from "../Repository";

const resource = "/payments";

export default {
    getSessionId(payload) {
        return Repository.post(`${resource}/checkout_session/`, payload)
    },
}
