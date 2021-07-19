import Repository from "../Repository";

const resource = "/request_restore_code";

export default {
    request(payload) {
        return Repository.post(`${resource}/`, payload)
    },
}
