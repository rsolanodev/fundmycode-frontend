<template>
  <layout name="LayoutApp">
    <div class="home">
      <div class="welcome align-cv" v-if="newUser">
        <div class="columns">
          <div class="column is-4 is-offset-2">
            <div class="content-box p-2">
              <div class="title is-4 my-1 has-text-weight-bold">
                Become a developer
              </div>
              <div class="subtitle is-6 mt-1 mb-3">
                Build a membership for your fans and get paid to create on your
                own terms.
              </div>
              <router-link
                to="/developer/create"
                class="button is-primary is-fullwidth"
                >Get started
              </router-link>
            </div>
          </div>
          <div class="column is-4">
            <div class="content-box p-2">
              <div class="title is-4 my-1 has-text-weight-bold">
                Find developers you love
              </div>
              <div class="subtitle is-6 mt-1 mb-3">
                The developers you already love may be here, explore!
              </div>
              <router-link to="/explore" class="button is-primary is-fullwidth"
                >Find developers
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <div class="feed" v-if="isLoadedPosts">
            <b-tabs v-model="activeTab">
              <b-tab-item label="All posts">
                <div class="posts_all" v-if="posts_all.length !== 0">
                  <Post v-bind:posts="posts_all" :profile="true"/>
                  <infinite-loading @infinite="infiniteHandler"/>
                </div>
                <div class="content-box" v-else>
                  <p>You aren’t following any developers yet.</p>
                </div>
              </b-tab-item>
              <b-tab-item label="Only financed users">
                <Post
                  v-if="posts_supporting.length !== 0"
                  :posts="posts_supporting"
                  :profile="true"
                />
                <div class="content-box" v-else>
                  <p>You aren’t supporting any developers yet.</p>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
          <loader v-else />
        </div>
        <div class="column is-one-quarter">
          <div class="content-box p-1">
            <div class="title is-6 my-1 has-text-weight-bold">Supporting</div>
            <div class="profiles" v-if="hasSupporting">
              <div
                v-for="item in supportingActive(supporting)"
                v-bind:key="item.id"
                class="card-profile has-pointer"
              >
                <router-link
                  :to="{
                    name: 'profile-public',
                    params: { udev: item.developer.url },
                  }"
                >
                  <div class="media py-1">
                    <figure class="media-left">
                      <div class="image is-32x32">
                        <img
                          v-if="item.developer.picture"
                          :src="item.developer.picture"
                          class="small-rounded"
                          alt="user picture"
                        />
                        <img
                          v-else
                          :src="default_picture"
                          class="small-rounded"
                          alt="default user picture"
                        />
                      </div>
                    </figure>
                    <div class="media-content">
                      <div class="title mb-1">
                        {{ item.developer.public_name }}
                      </div>
                      <div class="subtitle">{{ item.developer.about }}</div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div class="subtitle is-6 mt-1 my-2" v-else>
              You aren’t supporting any developers yet.
            </div>
          </div>
          <div class="content-box p-1">
            <div class="title is-6 my-1 has-text-weight-bold">Following</div>
            <div class="profiles" v-if="hasFollowers">
              <div
                v-for="item in following"
                v-bind:key="item.id"
                class="card-profile has-pointer"
              >
                <router-link
                  :to="{
                    name: 'profile-public',
                    params: { udev: item.to_user.url },
                  }"
                >
                  <div class="media py-1">
                    <figure class="media-left">
                      <div class="image is-32x32">
                        <img
                          v-if="item.to_user.picture"
                          :src="item.to_user.picture"
                          class="small-rounded"
                          alt="user picture"
                        />
                        <img
                          v-else
                          :src="default_picture"
                          class="small-rounded"
                          alt="default user picture"
                        />
                      </div>
                    </figure>
                    <div class="media-content">
                      <div class="title mb-1">
                        {{ item.to_user.public_name }}
                      </div>
                      <div class="subtitle">{{ item.to_user.about }}</div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div class="subtitle is-6 mt-1 my-2" v-else>
              You aren’t following any developers yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Layout from "../../layouts";
import { mapGetters } from "vuex";

import { RepositoryFactory } from "../../api/RepositoryFactory";
import moment from "moment";
import Post from "../../components/Post";
import constants from "../../constants";
import Loader from "../../components/Loader";

const PostsRepository = RepositoryFactory.get("posts");

export default {
  name: "feed",
  components: {
    Layout,
    Post,
    Loader,
  },
  data() {
    return {
      activeTab: 0,
      developer: {},
      banner: {},
      picture: {},
      posts_all: [],
      len_posts_all: 0,
      page_posts_all: 1,
      posts_supporting: [],
      default_picture: constants.DEFAULT_USER_PICTURE,
      isLoadedPosts: false,
      busy: false
    };
  },
  computed: {
    ...mapGetters({
      following: "myFollowing",
      supporting: "mySupporting",
    }),
    newUser() {
      return (
        !!this.$route.params.welcome && this.$route.params.welcome === "welcome"
      );
    },
    hasFollowers() {
      return this.following.length !== 0;
    },
    hasSupporting() {
      return this.supportingActive(this.supporting).length !== 0;
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      await PostsRepository.getFeedPage(this.page_posts_all).then((response) => {
        this.posts_all = response.data.results;
        this.len_posts_all = response.data.count;
      });
      await PostsRepository.getFeedOnlySupporting().then((response) => {
        this.posts_supporting = response.data.results;
      });
      this.isLoadedPosts = true;
    },
    async getFeed(page) {
      const { data } = await PostsRepository.getFeedPage(page);
      this.posts_all = this.posts_all.concat(data.results);
    },
    supportingActive(supporting) {
      return supporting.filter(
        (subscription) => subscription.status === "active"
      );
    },
    infiniteHandler($state) {
      this.page_posts_all++;
      let max = parseInt(this.len_posts_all / 10) + 1;
      if (this.page_posts_all <= max) {
        this.getFeed(this.page_posts_all);
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
  filters: {
    toPublicDateTime(value) {
      if (!value) return "";
      return moment(value).calendar();
    },
  },
};
</script>
<style scoped lang="scss">
.welcome {
  background-color: rgba(250, 250, 250, 0.85);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.tiers .content-box {
  .title {
    opacity: 1;
  }
}

.profiles {
  .title {
    font-size: 14px;
  }

  .subtitle {
    font-size: 12px;
  }

  .media {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  div:last-child .media {
    border-bottom: none;
  }
}
</style>
