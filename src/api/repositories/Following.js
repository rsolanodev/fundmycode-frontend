import Repository from "../Repository";

const resource = "/following";

export default {
    getAll(pk) {
        return Repository.get(`${resource}/?from_user=${pk}`)
    },
}
