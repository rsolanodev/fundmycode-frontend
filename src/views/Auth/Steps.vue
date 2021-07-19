<template>
  <layout name="LayoutSignupSteps">
    <div>
      <div class="step-1 px-2" v-if="step === 1">
        <div class="title is-3 pb-2">Who are you?</div>
        <div class="columns" style="width: 43vw;">
          <div class="column is-4">
            <div class="box-input has-text-weight-semibold">
              <b-field label="First name">
                <b-input
                  class="input"
                  type="text"
                  placeholder="i.e. Rubén"
                  v-model.trim="$v.first_name.$model"
                />
              </b-field>
            </div>
          </div>
          <div class="column">
            <div class="box-input has-text-weight-semibold">
              <b-field label="Last name">
                <b-input
                  class="input"
                  type="text"
                  placeholder="i.e. Solano Jiménez"
                  v-model.trim="$v.last_name.$model"
                />
              </b-field>
            </div>
          </div>
        </div>
        <div class="columns mb-3">
          <div class="column is-6">
            <div class="box-input has-text-weight-semibold">
              <b-field label="Date of birth">
                <b-datepicker
                  v-model="$v.birthday.$model"
                  placeholder="Click to select"
                  editable
                >
                </b-datepicker>
              </b-field>
            </div>
          </div>
          <div class="column">
            <div class="box-input has-text-weight-semibold">
              <b-field label="Country of residence">
                <v-select
                  label="countryName"
                  :options="countries"
                  v-model="$v.country.$model"
                  placeholder="Select your country"
                />
              </b-field>
            </div>
          </div>
        </div>
        <div class="container level">
          <div class="level-left">
            <span class="level-item">
              <router-link to="/signup" class="button is-secondary"
                >Back</router-link
              >
            </span>
          </div>
          <div class="level-right">
            <span class="level-item">
              <span
                class="button is-primary btn-shadow"
                disabled
                v-if="this.$v.$invalid"
                >Next</span
              >
              <router-link
                to="/signup/steps/2"
                class="button is-primary btn-shadow"
                v-else
                >Next</router-link
              >
            </span>
          </div>
        </div>
      </div>
      <div class="step-1 px-2" v-if="step === 2">
        <div class="title is-3 pb-2">Protect your account</div>
        <div class="box-input has-text-weight-semibold mb-2">
          <label>
            Your password
            <input
              class="input is-fullwidth"
              type="password"
              v-model="password"
              @keyup="statusPassword"
              placeholder="More than 8 characters"
              style="width: 40vw;"
              @keydown.46="statusPassword"
              showpassword
            />
          </label>
        </div>
        <div class="subtitle is-6">Strength</div>
        <div class="strength pb-5">
          <div
            class="bar"
            :class="{
              low: status_password === 'low',
              medium: status_password === 'medium',
              good: status_password === 'good',
              excellent: status_password === 'excellent',
            }"
          ></div>
          <div
            class="bar"
            :class="{
              medium: status_password === 'medium',
              good: status_password === 'good',
              excellent: status_password === 'excellent',
            }"
          ></div>
          <div
            class="bar"
            :class="{
              good: status_password === 'good',
              excellent: status_password === 'excellent',
            }"
          ></div>
          <div
            class="bar"
            :class="{
              excellent: status_password === 'excellent',
            }"
          ></div>
        </div>
        <div class="container level">
          <div class="level-left">
            <span class="level-item">
              <router-link to="/signup/steps/1" class="button is-secondary"
                >Back</router-link
              >
            </span>
          </div>
          <div class="level-right">
            <span class="level-item">
              <span
                class="button is-primary btn-shadow"
                disabled
                v-if="status_password === null || status_password === 'low'"
                >Next</span
              >
              <span
                class="button is-primary btn-shadow"
                v-else
                @click="createUser"
                >Next</span
              >
            </span>
          </div>
        </div>
      </div>
      <div class="step-1 px-2" v-if="step === 3">
        <div class="title is-3 pb-2">Welcome to FundMyCode</div>
        <div class="subtitle is-6 mb-4" style="width: 40vw;">
          Your account has been created successfully and you can start following
          your favorite developer or start generating recurring revenue.
        </div>
        <div class="container level">
          <div class="level-left">
            <span class="level-item" />
          </div>
          <div class="level-right">
            <span class="level-item">
              <span class="button is-primary btn-shadow" @click="logIn"
                >Next</span
              >
            </span>
          </div>
        </div>
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
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

import { RepositoryFactory } from "../../api/RepositoryFactory";
import moment from "moment";

const UsersRepository = RepositoryFactory.get("users");

export default {
  name: "SignupSteps",
  props: ["shared"],
  components: {
    Layout,
  },
  data() {
    return {
      email: this.shared.getEmail,
      step: parseInt(this.$route.params.index),
      password: "",
      status_password: null,
      first_name: "",
      last_name: "",
      birthday: null,
      country: null,
      countries: [
        { countryCode: "AT", countryName: "Austria" },
        { countryCode: "BE", countryName: "Belgium" },
        { countryCode: "BG", countryName: "Bulgaria" },
        { countryCode: "HR", countryName: "Croatia" },
        { countryCode: "CY", countryName: "Cyprus" },
        { countryCode: "CZ", countryName: "Czech Republic" },
        { countryCode: "EE", countryName: "Estonia" },
        { countryCode: "FR", countryName: "France" },
        { countryCode: "DE", countryName: "Germany" },
        { countryCode: "HU", countryName: "Hungary" },
        { countryCode: "IE", countryName: "Ireland" },
        { countryCode: "IT", countryName: "Italy" },
        { countryCode: "LV", countryName: "Latvia" },
        { countryCode: "LT", countryName: "Lithuania" },
        { countryCode: "LU", countryName: "Luxembourg" },
        { countryCode: "MT", countryName: "Malta" },
        { countryCode: "NL", countryName: "Netherlands" },
        { countryCode: "PL", countryName: "Poland" },
        { countryCode: "PT", countryName: "Portugal" },
        { countryCode: "RO", countryName: "Romania" },
        { countryCode: "SK", countryName: "Slovakia" },
        { countryCode: "SI", countryName: "Slovenia" },
        { countryCode: "ES", countryName: "Spain" },
        { countryCode: "SE", countryName: "Sweden" },
        { countryCode: "GB", countryName: "United Kingdom" },
      ],
      isLoading: false,
      is_verified: false,
    };
  },
  watch: {
    $route() {
      this.step = parseInt(this.$route.params.index);
    },
  },
  created() {
    if (!this.shared.getEmail) this.$router.push("/signup");
  },
  methods: {
    statusPassword() {
      let p = this.password;
      let l = p.length;

      if (l > 0 && 0 < 8) {
        this.status_password = "low";

        if (l >= 8) {
          if (/^[a-z]+$/.test(p)) {
            this.status_password = "medium";
          } else if (/^[0-9]+$/.test(p)) {
            this.status_password = "low";
          } else if (/^[A-Za-z]+$/.test(p)) {
            this.status_password = "good";
          } else if (/^[A-Za-z0-9]+$/.test(p)) {
            this.status_password = "excellent";
          } else {
            this.status_password = "excellent";
          }
        }
      } else if (l === 0) {
        this.status_password = null;
      }
    },
    async createUser() {
      this.isLoading = true;
      let birthday = moment(this.birthday).format("YYYY-MM-DD");
      const payload = {
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        birthday: birthday,
        country: this.country.countryCode,
      };
      await UsersRepository.createUser(payload);
      this.isLoading = false;
      await this.$router.push("/signup/steps/3");
      // setInterval(this.isVerified, 3000)
    },
    /*
            async isVerified() {
                if(!this.is_verified) {
                    await UsersRepository.checkVerify(this.email).then((response) => {
                        this.is_verified = response.data.is_verified;
                    });
                }
            },*/
    logIn() {
      this.isLoading = true;
      let email = this.email;
      let password = this.password;
      this.$store.dispatch("login", { email, password }).then(async () => {
        await this.$store.dispatch("getUser").finally(async () => {
          this.isLoading = false;
          await this.$router.push("/feed/welcome");
        });
      });
    },
  },
  mixins: [validationMixin],
  validations: {
    first_name: {
      required,
    },
    last_name: {
      required,
    },
    birthday: {
      required,
    },
    country: {
      required,
    },
  },
};
</script>

<style scoped lang="scss">
.box-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.strength {
  display: flex;

  .bar {
    width: 100%;
    height: 6px;
    border-radius: 2px;
    margin: 5px;
    background-color: rgba(0, 0, 0, 0.115);

    &.low {
      background-color: #ff0c00;
    }

    &.medium {
      background-color: #ff9500;
    }

    &.good {
      background-color: #02b541;
    }

    &.excellent {
      background-color: #02b541;
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.button {
  border-radius: 0;
  padding: 1.5em 3em;
}

span.button {
  color: #fff !important;
}
</style>
