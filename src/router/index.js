import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home/Index";
import About from "../views/Home/About";

import Login from "../views/Auth/Login";
import Signup from "../views/Auth/SignUp";
import SignupSteps from "../views/Auth/Steps";
import Verified from "../views/Auth/Verified";

import Feed from "../views/App/Feed";
import Profile from "../views/App/profile/ProfileBase";
import SettingsProfile from "../views/App/UserSettings";
import BeDeveloper from "../views/App/BeDeveloper";
import ProfilePublic from "../views/App/profile/ProfilePublic";
import ProfileDeveloperEdit from "../views/App/profile/ProfileDeveloperEdit";
import Explore from "../views/App/Explore";

import store from '../store'
import EditPost from "../views/App/EditPost";
import EditTier from "../views/App/EditTier";
import Memberships from "../views/App/Memberships";
import ForgotPassword from "../views/Auth/ForgotPassword";
import RestorePassword from "../views/Auth/RestorePassword";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/about",
        name: "about",
        component: About
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: {
            notAuth: true,
        }
    },
    {
        path: "/signup",
        name: "signup",
        component: Signup,
        meta: {
            notAuth: true,
        }
    },
    {
        path: "/forgot-password",
        name: "forgot-password",
        component: ForgotPassword,
        meta: {
            notAuth: true,
        }
    },
    {
        path: "/restore-password/:restore_password_code",
        name: "restore-password",
        component: RestorePassword,
        meta: {
            notAuth: true,
        }
    },
    {
        path: "/signup/steps/:index",
        name: "signup-steps",
        component: SignupSteps,
        meta: {
            notAuth: true,
        }
    },
    {
        path: "/feed/:welcome?",
        name: "feed",
        component: Feed,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/profile",
        name: "profile",
        component: Profile,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/settings/profile",
        name: "settings-profile",
        component: SettingsProfile,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/memberships",
        name: "memberships",
        component: Memberships,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "/developer/create",
        name: "create-developer",
        component: BeDeveloper,
        meta: {
            notDeveloper: true,
        }
    },
    {
        path: "/developer/:udev",
        name: "profile-public",
        component: ProfilePublic
    },
    {
        path: "/explore",
        name: "explore",
        component: Explore
    },
    {
        path: "/edit",
        name: "edit-developer",
        component: ProfileDeveloperEdit,
        meta: {
            requiresDev: true,
        }
    },
    {
        path: "/post/:id?",
        name: "edit-post",
        component: EditPost,
        meta: {
            requiresDev: true,
        }
    },
    {
        path: "/tier/:id?",
        name: "edit-tier",
        component: EditTier,
        meta: {
            requiresDev: true,
        }
    },
    {
        path: "/verified/:token",
        name: "verified",
        component: Verified,
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next();
            return
        }
        next('/login')
    } else if (to.matched.some(record => record.meta.requiresDev)) {
        store.dispatch('getUser').finally(() => {
            if (store.getters.isLoggedIn && store.getters.isDeveloper) {
                next();
            } else if (store.getters.isLoggedIn && !store.getters.isDeveloper) {
                next('/feed');
            } else {
                next('/login')
            }
        });
    } else if (to.matched.some(record => record.meta.notDeveloper)) {
        store.dispatch('getUser').finally(() => {
            if (store.getters.isLoggedIn && store.getters.isDeveloper) {
                next('/feed');
            } else if (store.getters.isLoggedIn && !store.getters.isDeveloper) {
                next();
            } else {
                next('/login')
            }
        });
    }  else if (to.matched.some(record => record.meta.notAuth)) {
            if (store.getters.isLoggedIn) {
                next('/feed');
                return
            }
            next();
    } else {
        next()
    }
});

export default router;
