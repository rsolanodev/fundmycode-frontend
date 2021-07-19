import Repository from "../Repository";

const resource = "/verify_email";

export default {
    validate(payload) {
        return Repository.post(`${resource}/`, payload)
    },
}
