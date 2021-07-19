import Developer from "./repositories/Developer";
import User from "./repositories/User";
import Auth from "./repositories/Auth";
import Technology from "./repositories/Technology";
import Post from "./repositories/Post";
import Following from "./repositories/Following";
import Verify from "./repositories/Verify";
import Comment from "./repositories/Comment"
import Tier from "./repositories/Tier";
import Subscription from "./repositories/Subscription";
import Payment from "./repositories/Payment";
import RequestRestoreCode from "./repositories/RequestRestoreCode";
import RestorePassword from "./repositories/RestorePassword";

const repositories = {
    users: User,
    developers: Developer,
    auth: Auth,
    technologies: Technology,
    posts: Post,
    following: Following,
    verify: Verify,
    comments: Comment,
    tiers: Tier,
    subscriptions: Subscription,
    payments: Payment,
    request_restore_code: RequestRestoreCode,
    restore_password: RestorePassword
};

export const RepositoryFactory = {
    get: name => repositories[name]
};
