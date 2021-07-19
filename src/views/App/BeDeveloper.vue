<template>
  <layout name="LayoutApp">
    <div class="be-developer px-2">
      <div class="title is-5 mb-2 has-text-weight-medium">
        Create your developer profile
      </div>
      <div class="content-box">
        <b-steps v-model="activeStep" :has-navigation="false">
          <b-step-item label="Welcome">
            <hr />
            <div class="my-4">
              <div class="title is-5 mt-2 mb-2">Welcome to FundMyCode!</div>
              <div class="columns mb-4">
                <div class="column is-7">
                  <div class="subtitle is-6">
                    We are excited about your arrival and hope that our services
                    help you to continue doing what you love.
                  </div>
                  <div class="subtitle is-6">
                    Next you must then complete a form to create your developer
                    profile and start to fund your work.
                  </div>
                </div>
              </div>
            </div>
            <button
              class="button is-primary btn-shadow"
              @click="activeStep = 1"
            >
              Next
            </button>
          </b-step-item>
          <b-step-item label="Profile">
            <hr />
            <div class="my-4">
              <div class="title is-5 mt-2 mb-2">
                What name would you like to appear on your developer profile?
              </div>
              <div class="columns mb-6">
                <div class="column is-7">
                  <div class="box-input has-text-weight-semibold">
                    <b-field label="Your public name">
                      <b-input
                        class="input"
                        type="text"
                        placeholder="i.e. Dekalabs"
                        v-model.trim="$v.name.$model"
                      />
                    </b-field>
                  </div>
                </div>
              </div>
            </div>
            <button class="button is-secondary mr-1" @click="activeStep = 0">
              Back
            </button>
            <button
              class="button is-primary btn-shadow"
              @click="changeStep($v.name.$invalid, 2)"
              :disabled="$v.name.$invalid"
            >
              Next
            </button>
          </b-step-item>
          <b-step-item label="Work">
            <hr />
            <div class="my-4">
              <div class="title is-5 mt-2 mb-2">
                Describe your developer profile in one sentence
              </div>
              <div class="columns mb-6">
                <div class="column is-7">
                  <div class="box-input has-text-weight-semibold">
                    <b-field label="What are you doing?">
                      <b-input
                        class="input"
                        type="text"
                        placeholder="e.g. Creating the FundMyCode project"
                        v-model.trim="$v.about.$model"
                      />
                    </b-field>
                  </div>
                </div>
              </div>
            </div>
            <button class="button is-secondary mr-1" @click="activeStep = 1">
              Back
            </button>
            <button
              class="button is-primary btn-shadow"
              @click="changeStep($v.about.$invalid, 3)"
              :disabled="$v.about.$invalid"
            >
              Next
            </button>
          </b-step-item>
          <b-step-item label="Tech">
            <hr />
            <div class="my-4">
              <div class="title is-5 mt-2 mb-2">
                What are the technologies that are most described with your
                profile
              </div>
              <div class="subtitle is-6">
                Pick up to three
              </div>
              <div class="columns is-multiline">
                <div
                  class="column is-one-fifth"
                  v-for="tech in list_technologies"
                  v-bind:key="tech.id"
                >
                  <b-checkbox
                    size="is-small"
                    class="mb-1"
                    v-model="technologies"
                    :native-value="tech.id"
                  >
                    {{ tech.title }}
                  </b-checkbox>
                </div>
              </div>
            </div>
            <button class="button is-secondary mr-1" @click="activeStep = 2">
              Back
            </button>
            <button
              class="button is-primary btn-shadow"
              @click="createDeveloper"
              :disabled="technologies.length < 1"
            >
              Next
            </button>
          </b-step-item>
          <b-step-item label="Validation" class="has-text-centered">
            <hr />
            <div class="my-4">
              <div class="title is-5 mb-2">
                Congratulations, your registration is complete
              </div>
              <div class="subtitle is-6 has-text-centered mb-3">
                Our team will verify that you can be part of FundMyCode<br />and
                can start earning income.
              </div>
            </div>
            <router-link to="/edit" class="button is-primary btn-shadow mb-2"
              >Edit my page</router-link
            >
          </b-step-item>
        </b-steps>
      </div>
      <b-loading
        :is-full-page="true"
        :active.sync="isLoading"
        :can-cancel="false"
      />
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts/index";
import { mapGetters } from "vuex";

import { RepositoryFactory } from "../../api/RepositoryFactory";
import { validationMixin } from "vuelidate";
import { minLength, required } from "vuelidate/lib/validators";

const TechnologiesRepository = RepositoryFactory.get("technologies");
const UsersRepository = RepositoryFactory.get("users");

export default {
  name: "BeDeveloper",
  components: {
    Layout,
  },
  data() {
    return {
      name: "",
      about: "",
      technologies: [],
      list_technologies: [],
      activeStep: 0,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      userDetails: "myUser",
    }),
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const { data } = await TechnologiesRepository.getAll();
      this.list_technologies = data;
    },
    async createDeveloper() {
      this.isLoading = true;
      const payload = {
        public_name: this.name,
        about: this.about,
        technologies: this.technologies,
      };
      await UsersRepository.createDeveloper(
        payload,
        this.userDetails.id
      ).finally(() => {
        this.$store.dispatch("getUser").finally(() => {
          this.isLoading = false;
          this.activeStep = 4;
        });
      });
    },
    changeStep(validate, value) {
      if (!validate) {
        this.activeStep = value;
      }
    },
  },
  mixins: [validationMixin],
  validations: {
    name: {
      required,
      minLength: minLength(3),
    },
    about: {
      required,
      minLength: minLength(3),
    },
  },
};
</script>

<style scoped>
.box-input {
  border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
}
</style>
