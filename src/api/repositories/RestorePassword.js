import Repository from "../Repository";

const resource = "/restore_password";

export default {
    restore(payload) {
        return Repository.post(`${resource}/`, payload)
    },
}
