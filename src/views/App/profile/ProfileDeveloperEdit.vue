<template>
  <layout name="LayoutApp">
    <div class="edit-page">
      <div class="content-box is-paddingless">
        <b-tabs v-model="activeTab">
          <b-tab-item label="About">
            <div class="has-text-centered mt-1 mb-3">
              <div class="title is-4">About</div>
              <div class="subtitlte is-6">
                Configure your profile details and make a great <br />first
                impression
              </div>
            </div>
            <div class="title is-5 mb-2 has-text-weight-medium">
              Basic details
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="box-input has-text-weight-semibold">
                  <b-field label="Your public name">
                    <b-input
                      class="input"
                      type="text"
                      placeholder="i.e. Dekalabs"
                      v-model="developer.public_name"
                    />
                  </b-field>
                </div>
              </div>
              <div class="column is-6">
                <div class="box-input has-text-weight-semibold">
                  <b-field label="What are you doing?">
                    <b-input
                      class="input"
                      type="text"
                      placeholder="e.g. the FundMyCode project"
                      v-model="developer.about"
                    />
                  </b-field>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <div class="box-input has-text-weight-semibold">
                  <b-field label="Picture">
                    <b-upload v-model="picture" drag-drop class="my-1">
                      <section class="section">
                        <div class="content has-text-centered">
                          <div>
                            <b-icon icon="upload"> </b-icon>
                          </div>
                          <small class="context-input"
                            >Drop or click<br />to upload</small
                          >
                          <div class="picture-filename">{{ picture.name }}</div>
                        </div>
                      </section>
                    </b-upload>
                  </b-field>
                </div>
              </div>
              <div class="column is-9">
                <div class="box-input has-text-weight-semibold">
                  <b-field label="Banner">
                    <b-upload v-model="banner" drag-drop class="my-1">
                      <section class="section">
                        <div class="content has-text-centered">
                          <div>
                            <b-icon icon="upload"> </b-icon>
                          </div>
                          <small class="context-input"
                            >Drop or click<br />to upload</small
                          >
                          <div class="picture-filename">{{ banner.name }}</div>
                        </div>
                      </section>
                    </b-upload>
                  </b-field>
                </div>
              </div>
            </div>
            <div class="container level">
              <div class="level-left">
                <span class="level-item" />
              </div>
              <div class="level-right">
                <span
                  class="level-item button is-primary btn-shadow"
                  @click="updateDeveloper"
                >
                  Save changes
                </span>
              </div>
            </div>
          </b-tab-item>

          <b-tab-item label="Tiers">
            <div class="has-text-centered mt-1 mb-3">
              <div class="title is-4">Tiers</div>
              <div class="subtitlte is-6">
                Choose what to offer your subscribers
              </div>
            </div>
            <div class="columns is-multiline tiers">
              <div
                class="column is-4"
                v-for="item in tiers"
                v-bind:key="item.id"
              >
                <div class="box-input is-fullheight">
                  <div class="columns mb-0">
                    <div class="column is-8">
                      <small class="is-inline-block"
                        >{{ item.public ? "Published" : "Unpublished" }}
                        {{ item.modified | toPublicDateTime }}</small
                      >
                      <small class="is-inline-block"
                        >{{ item.subscribers_count }} suscribers</small
                      >
                    </div>
                    <div class="column has-text-right is-4">
                      <small>
                        <router-link
                          :to="{ name: 'edit-tier', params: { id: item.id } }"
                        >
                          Edit tier
                        </router-link>
                      </small>
                    </div>
                  </div>
                  <div class="title is-6 my-1 has-text-weight-bold">
                    {{ item.title }}
                  </div>
                  <small>${{ item.price }} per month</small>
                  <div
                    class="subtitle mb-2 content"
                    v-html="tierDescription(item.description)"
                  ></div>
                  <small class="is-inline-block limit"
                    >Limit:
                    {{ item.limit !== null ? item.limit : "unlimited" }}</small
                  >
                  <small class="is-inline-block remove-tier has-pointer" @click="removeTier(item.id)">Remove tier</small>
                </div>
              </div>
              <div class="column is-4">
                <router-link :to="{ name: 'edit-tier' }">
                  <div class="box-input is-fullheight has-pointer">
                    <div class="my-1 has-text-centered has-text-weight-medium">
                      + Add tier
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from "../../../layouts";
import { RepositoryFactory } from "../../../api/RepositoryFactory";
import { nytMixins } from "../../../mixins";
import moment from "moment";

const DevelopersRepository = RepositoryFactory.get("developers");
const TiersRepository = RepositoryFactory.get("tiers");

export default {
  name: "ProfileDeveloperEdit",
  components: {
    Layout,
  },
  data() {
    return {
      activeTab: 0,
      showBooks: false,
      developer: {},
      banner: {},
      picture: {},
      tiers: [],
    };
  },
  mixins: [nytMixins],
  filters: {
    toPublicDateTime(value) {
      if (!value) return "";
      return moment(value).format("LL");
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const { data } = await DevelopersRepository.me();
      this.developer = data;
      await this.getTiers();
    },
    async updateDeveloper() {
      let payload = {
        public_name: this.developer.public_name,
        about: this.developer.about,
      };

      if (this.isFile(this.picture)) {
        let formData = new FormData();
        formData.append("picture", this.picture);
        await DevelopersRepository.updateDeveloper(formData);
      }

      if (this.isFile(this.banner)) {
        let formData = new FormData();
        formData.append("banner", this.banner);
        await DevelopersRepository.updateDeveloper(formData);
      }

      await DevelopersRepository.updateDeveloper(payload).finally(() => {
        this.$buefy.toast.open({
          message: "Profile updated successfully",
          type: "is-success",
          position: "is-bottom",
        });
        this.$store.dispatch("getUser");
      });
    },
    async getTiers() {
      const { data } = await TiersRepository.getTiers(this.developer.id);
      this.tiers = data;
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
    removeTier(id) {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to delete this tier?',
        onConfirm: () => {
          TiersRepository.delete(id).then(() => {
            this.getTiers();
          }, () => this.$buefy.toast.open({
            message: 'The tier was not deleted',
            type: 'is-danger',
            position: 'is-bottom'
          }));
        }
      })
    }
  },
};
</script>

<style scoped lang="scss">
.picture-filename {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 13px;
  color: #c2c2c2;
}

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

.tiers .content-box {
  .title {
    opacity: 1;
  }
}

.limit {
  position: absolute;
  bottom: 5px;
}

.remove-tier {
  position: absolute;
  right: 10px;
  bottom: 5px;
  text-decoration: underline;
}

.box-input {
  position: relative;
  padding-bottom: 0.75em;
}
</style>
