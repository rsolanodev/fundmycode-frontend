import Repository from "../Repository";

const resource = "/technologies";

export default {
    getAll() {
        return Repository.get(`${resource}/`);
    },
}
