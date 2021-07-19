<template>
  <layout name="LayoutApp">
    <div class="profile px-2">
      <div class="columns">
        <div class="column is-9">
          <div class="profile" v-if="isLoadedData">
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
                  <div v-if="developer.id !== userDetails.id">
                    <button
                      class="button is-primary is-active"
                      @click="unfollow"
                      v-if="isFollowing"
                    >
                      Unfollow
                    </button>
                    <button class="button is-primary" @click="follow" v-else>
                      Follow
                    </button>
                  </div>
                  <button class="button is-secondary">
                    <b-icon
                      pack="fas"
                      icon="share-alt"
                      size="is-small"
                      style="opacity: 0.6;"
                    >
                    </b-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Post :posts="posts" v-if="hasPosts && isLoadedData" />
          <div class="content-box" v-else-if="!hasPosts && isLoadedData">
            <div class="my-1 has-text-centered">
              <div class="title is-5 mb-2">Sorry, but there are no posts.</div>
            </div>
          </div>
          <loader background="#" v-else />
        </div>
        <div class="column is-3">
          <div class="content-box has-pointer" v-if="!hasTiers && isLoadedData">
            <div class="my-1 has-text-centered has-text-weight-medium">
              This developer hasn't yet created any tier
            </div>
          </div>
          <div v-else-if="hasTiers && isLoadedData" class="tiers">
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
          <loader background="#" v-else />
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from "../../../layouts";
import { RepositoryFactory } from "../../../api/RepositoryFactory";
import Loader from "../../../components/Loader";
import Post from "../../../components/Post";
import moment from "moment";
import { mapGetters } from "vuex";
import constants from "../../../constants";

const DevelopersRepository = RepositoryFactory.get("developers");
const PostsRepository = RepositoryFactory.get("posts");
const TiersRepository = RepositoryFactory.get("tiers");
const PaymentsRepository = RepositoryFactory.get("payments");

const stripe = window.Stripe("pk_test_fblJlAFph5pIril3f1I3J6An00xCFoa1Nc");

export default {
  name: "ProfilePublic",
  components: {
    Layout,
    Loader,
    Post,
  },
  data() {
    return {
      activeTab: 0,
      developer: {},
      posts: [],
      tiers: [],
      isLoadedData: false,
      default_picture: constants.DEFAULT_USER_PICTURE,
      default_banner: constants.DEFAULT_USER_BANNER,
      items: [],
    };
  },
  computed: {
    ...mapGetters({
      following: "myFollowing",
      userDetails: "myUser",
    }),
    hasTiers() {
      return this.tiers.length > 0;
    },
    hasPosts() {
      return this.posts.length > 0;
    },
    isFollowing() {
      return this.following.some(
        (user) => this.developer.id === user.to_user.id
      );
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const { data } = await DevelopersRepository.getDeveloper(
        this.$route.params.udev
      );
      let dev = data.results.shift();
      this.developer = dev;
      await this.getPosts();
      await this.getTiers();
      this.isLoadedData = true;
    },
    async getPosts() {
      const payload = {
        user: this.developer.id,
      };
      const { data } = await PostsRepository.filter(payload);
      this.posts = data.results;
    },
    async getTiers() {
      const { data } = await TiersRepository.getTiers(this.developer.id);
      this.tiers = data;
    },
    confirm(id) {
      this.$buefy.dialog.confirm({
        message: "Are you sure to delete this post?",
        onConfirm: () => {
          PostsRepository.delete(id).then(
            async () => {
              this.$buefy.toast.open({
                message: "Post deleted successfully",
                type: "is-success",
                position: "is-bottom",
              });
              this.isLoadedData = false;
              await this.getPosts();
              this.isLoadedData = true;
            },
            () =>
              this.$buefy.toast.open({
                message: "The post was not deleted",
                type: "is-danger",
                position: "is-bottom",
              })
          );
        },
      });
    },
    async follow() {
      await DevelopersRepository.follow(this.developer.id);
      await this.$store.dispatch("getUser");
    },
    async unfollow() {
      await DevelopersRepository.unfollow(this.developer.id);
      await this.$store.dispatch("getUser");
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
  filters: {
    toPublicDateTime(value) {
      if (!value) return "";
      return moment(value).calendar();
    },
    readMore(value, dir) {
      value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
      return dir === "more" ? value.substring(0, 170) : value.substring(170);
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
}

.subtitle {
  padding-top: 0.5em;
  font-size: 14px;
}

.posts .content-box {
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
