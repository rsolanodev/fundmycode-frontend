<template>
  <layout name="LayoutApp">
    <div class="explore">
      <div class="columns">
        <div class="column">
          <div class="content-box" v-if="isLoadedExplore">
            <div class="title is-5 mb-2 has-text-weight-medium">
              Find your favorite developer!
            </div>
            <section class="is-relative my-3">
              <div class="columns is-multiline">
                <div
                  class="column is-one-third"
                  v-for="item in list_developers.results"
                  v-bind:key="item.id"
                >
                  <div class="content-box p-1 card-profile">
                    <div class="media">
                      <figure class="media-left">
                        <div class="image is-32x32">
                          <img
                            v-if="item.picture"
                            :src="item.picture"
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
                        <router-link
                          :to="{
                            name: 'profile-public',
                            params: { udev: item.url },
                          }"
                        >
                          <div class="title is-7 mb-1">
                            {{ item.public_name }}
                          </div>
                          <div class="subtitle is-7">{{ item.about }}</div>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="layer-loader" :class="{ 'is-active': isLoading }" />
            </section>
            <b-pagination
              :total="total"
              :current.sync="current"
              :range-before="rangeBefore"
              :range-after="rangeAfter"
              :simple="isSimple"
              :rounded="isRounded"
              :per-page="perPage"
              :icon-prev="prevIcon"
              :icon-next="nextIcon"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
            >
            </b-pagination>
          </div>
          <loader v-else />
        </div>
        <div class="column is-one-quarter">
          <div class="content-box p-1" v-if="isLoadedTechs">
            <div class="title is-6 my-1 has-text-weight-bold">
              Filter by technologies
            </div>
            <div class="subtitle is-6 mt-1 my-2">
              Find developers by technologies.
            </div>
            <div
              class="is-block mb-1"
              v-for="tech in list_techs"
              v-bind:key="tech.id"
            >
              <b-checkbox
                size="is-small"
                v-model="technologies"
                :native-value="tech.id"
              >
                {{ tech.title }}
              </b-checkbox>
            </div>
          </div>
          <loader v-else />
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Layout from "../../layouts";
import { RepositoryFactory } from "../../api/RepositoryFactory";
import Loader from "../../components/Loader";

import constants from "../../constants";

const DevelopersRepository = RepositoryFactory.get("developers");
const TechnologiesRepository = RepositoryFactory.get("technologies");

export default {
  name: "Explore",
  components: {
    Layout,
    Loader,
  },
  data() {
    return {
      list_developers: [],
      list_techs: [],
      current: 1,
      perPage: 12,
      rangeBefore: 3,
      rangeAfter: 1,
      isSimple: false,
      isRounded: false,
      prevIcon: "chevron-left",
      nextIcon: "chevron-right",
      isLoading: false,
      isLoadedExplore: false,
      isLoadedTechs: false,
      technologies: [],
      filters: "",
      default_picture: constants.DEFAULT_USER_PICTURE,
    };
  },
  computed: {
    total: {
      get() {
        return this.list_developers.count;
      },
      set() {
        this.total = this.list_developers.count;
      },
    },
  },
  created() {
    this.fetch();
  },
  watch: {
    current() {
      this.getDevelopers(this.current);
    },
    technologies() {
      let filter = "";
      this.technologies.forEach((tech_id) => {
        filter += `&technologies=${tech_id}`;
      });
      this.filters = filter;
      this.getDevelopers(this.current);
    },
  },
  methods: {
    async fetch() {
      await this.getDevelopers(this.current);
      this.isLoadedExplore = true;
      const techs = await TechnologiesRepository.getAll();
      this.list_techs = techs.data;
      this.isLoadedTechs = true;
    },
    async getDevelopers(page) {
      this.isLoading = true;
      const { data } = await DevelopersRepository.getPage(page, this.filters);
      this.list_developers = data;
      this.isLoading = false;
    },
  },
};
</script>
<style scoped lang="scss">
.layer-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 300ms;
  display: none;

  &.is-active {
    display: block;
    background-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
