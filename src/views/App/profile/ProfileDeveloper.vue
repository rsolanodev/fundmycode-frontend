<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="profile" v-if="isLoadedPosts">
          <div class="content-box is-paddingless">
            <figure class="image is-3by1">
              <img
                v-if="developer.banner"
                :src="developer.banner"
                alt="developer banner"
              />
              <img
                v-else
                :src="default_banner"
                alt="default developer banner"
              />
            </figure>
            <figure class="image is-160x160 avatar">
              <img
                v-if="developer.picture"
                :src="developer.picture"
                class="is-rounded is-bordered has-background-white"
                alt="developer picture"
                style="border: 3px solid white;"
              />
              <img
                v-else
                :src="default_picture"
                class="is-rounded is-bordered"
                alt="default developer picture"
                style="border: 3px solid white;"
              />
            </figure>
          </div>
          <div class="content-box pt-6">
            <div class="level">
              <div class="level-left">
                <div class="title is-6">{{ developer.public_name }}</div>
                <div class="subtitle is-6">
                  {{ developer.about }}
                </div>
              </div>
              <div class="level-right">
                <router-link to="/post" class="button is-secondary"
                  >Create post</router-link
                >
                <router-link to="/edit" class="button is-primary"
                  >Edit page</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <Post :posts="posts" tools="true" v-if="hasPosts && isLoadedPosts" />
        <div class="content-box" v-else-if="!hasPosts && isLoadedPosts">
          <div class="my-1 has-text-centered">
            <div class="title is-5 mb-2">
              Sorry, but you don't write any post!
            </div>
            <div class="subtitle is-6 has-text-centered mb-3">
              You can write your first post and your followers <br />will know
              what you are doing
            </div>
            <router-link to="/post" class="button is-primary btn-shadow"
              >Make your first post</router-link
            >
          </div>
        </div>
        <loader v-else />
      </div>
      <div class="column is-one-quarter">
        <div v-if="!hasTiers && isLoadedTiers">
          <router-link :to="{ name: 'edit-tier' }">
            <div class="content-box has-pointer">
              <div class="my-1 has-text-centered has-text-weight-medium">
                + Add tier
              </div>
            </div>
          </router-link>
        </div>
        <div v-else-if="hasTiers && isLoadedTiers" class="tiers">
          <div
            class="content-box p-1"
            v-for="tier in tiers"
            v-bind:key="tier.id"
          >
            <div class="title is-6 my-1 has-text-weight-bold">
              {{ tier.title }}
            </div>
            <div class="small has-text-weight-semibold">
              {{ tier.price | priceToString }}
            </div>
            <div
              class="subtitle mb-2 content"
              v-html="tierDescription(tier.description)"
            ></div>
            <button
              class="button is-secondary is-small is-fullwidth"
              @click="checkout(tier.code)"
            >
              Be {{ tier.title }}
            </button>
          </div>
        </div>
        <loader v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { RepositoryFactory } from "../../../api/RepositoryFactory";
import Loader from "../../../components/Loader";
import moment from "moment";
import constants from "../../../constants";
import Post from "../../../components/Post";

const DevelopersRepository = RepositoryFactory.get("developers");
const PostsRepository = RepositoryFactory.get("posts");
const TiersRepository = RepositoryFactory.get("tiers");
const PaymentsRepository = RepositoryFactory.get("payments");

const stripe = window.Stripe("pk_test_fblJlAFph5pIril3f1I3J6An00xCFoa1Nc");

export default {
  name: "ProfileDeveloper",
  components: {
    Loader,
    Post,
  },
  data() {
    return {
      activeTab: 0,
      developer: {},
      posts: [],
      tiers: [],
      isLoadedPosts: false,
      isLoadedTiers: false,
      default_picture: constants.DEFAULT_USER_PICTURE,
      default_banner: constants.DEFAULT_USER_BANNER,
      items: [],
    };
  },
  created() {
    this.$root.$refs.ProfileDeveloper = this;
    this.fetch();
  },
  methods: {
    async fetch() {
      const { data } = await DevelopersRepository.me();
      this.developer = data;
      await this.getPosts();
      await this.getTiers();
    },
    async getPosts() {
      const { data } = await PostsRepository.filter({
        user: this.developer.id,
      });
      this.posts = data.results;
      this.isLoadedPosts = true;
    },
    async getTiers() {
      const { data } = await TiersRepository.getTiers(this.developer.id);
      this.tiers = data;
      this.isLoadedTiers = true;
    },
    tierDescription(value) {
      let options = value.split("\n");
      let result = `<ul>`;
      options.forEach((option) => {
        result += `<li>${option}</li>`;
      });
      result += `</ul>`;
      return result;
    },
    addItem(code) {
      this.items = [
        {
          plan: code,
          quantity: 1,
        },
      ];
    },
    async checkout(code) {
      this.addItem(code);
      const { data } = await PaymentsRepository.getSessionId({ code: code });
      stripe
        .redirectToCheckout({
          sessionId: data.id,
        })
        .then(function (result) {
          // eslint-disable-next-line no-console
          console.log(result.error.message);
        });
    },
  },
  computed: {
    hasTiers() {
      return this.tiers.length > 0;
    },
    hasPosts() {
      return this.posts.length > 0;
    },
  },
  filters: {
    toPublicDateTime(value) {
      if (!value) return "";
      return moment(value).calendar();
    },
    priceToString(value) {
      return `$${value} per month`;
    },
  },
};
</script>

<style scoped lang="scss">
.level-left {
  flex-direction: column;
  align-items: flex-start;

  .title {
    opacity: 1 !important;
  }
}

.subtitle {
  padding-top: 0.5em;
  font-size: 14px;
}

.content-box {
  .title {
    opacity: 0.65;
    transition: 200ms;
  }

  &:hover {
    .title {
      opacity: 0.9;
    }
  }

  .level-item {
    margin-left: 0.75em;
  }
}

.tiers .content-box {
  .title {
    opacity: 1;
  }
}
</style>
