<template>
  <layout name="LayoutApp">
    <div class="user-settings">
      <div class="content-box">
        <div class="title is-5 mb-2 has-text-weight-medium">Information</div>
        <div class="columns">
          <div class="column is-4">
            <div class="box-input has-text-weight-semibold">
              <b-field label="First name">
                <b-input
                  class="input"
                  type="text"
                  placeholder="i.e. Rubén"
                  v-model="_first_name"
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
                  v-model="_last_name"
                />
              </b-field>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6">
            <div class="box-input has-text-weight-semibold">
              <b-field label="Date of birth">
                <b-datepicker
                  v-model="_birthday"
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
                  :value="_country"
                  placeholder="Select your country"
                  :reduce="(country) => country.countryCode"
                  @input="setCountry"
                />
              </b-field>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-9">
            <div class="box-input has-text-weight-semibold">
              <b-field label="About you">
                <b-input
                  type="textarea"
                  v-model="_about"
                  minlength="10"
                  maxlength="520"
                  placeholder="Tell us something about you..."
                  class="py-1"
                >
                </b-input>
              </b-field>
            </div>
          </div>
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
        </div>
        <div class="container level">
          <div class="level-left">
            <span class="level-item" />
          </div>
          <div class="level-right">
            <span
              class="level-item button is-primary btn-shadow"
              @click="updateUser"
            >
              Save changes
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
import Layout from "../../layouts";

import { RepositoryFactory } from "../../api/RepositoryFactory";
import moment from "moment";
import { mapGetters } from "vuex";
import { nytMixins } from "../../mixins";

const UsersRepository = RepositoryFactory.get("users");

export default {
  name: "SettingsProfile",
  components: {
    Layout,
  },
  mixins: [nytMixins],
  data() {
    return {
      picture: {},
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
      payload: {},
    };
  },
  computed: {
    ...mapGetters({
      userDetails: "myUser",
    }),
    _first_name: {
      get() {
        return this.userDetails.first_name;
      },
      set(value) {
        this.payload.first_name = value;
      },
    },
    _last_name: {
      get() {
        return this.userDetails.last_name;
      },
      set(value) {
        this.payload.last_name = value;
      },
    },
    _birthday: {
      get() {
        return new Date(Date.parse(this.userDetails.birthday));
      },
      set(value) {
        this.payload.birthday = moment(value).format("YYYY-MM-DD");
      },
    },
    _country: {
      get() {
        return this.getCountry(this.userDetails.country);
      },
    },
    _about: {
      get() {
        return this.userDetails.about;
      },
      set(value) {
        this.payload.about = value;
      },
    },
  },
  methods: {
    getCountry(c) {
      let country = this.countries.filter(
        (country) => country.countryCode === c
      );
      return country[0];
    },
    setCountry(c) {
      this.payload.country = c;
    },
    async updateUser() {
      this.isLoading = true;
      await UsersRepository.updateUser(this.payload)
        .then(async () => {
          if (this.isFile(this.picture)) {
            let formData = new FormData();
            formData.append("picture", this.picture);
            await UsersRepository.updateUser(formData);
          }
        })
        .finally(() => {
          this.payload = {};
          this.$store.dispatch("getUser");
        });
      this.isLoading = false;
    },
  },
};
</script>
<style scoped lang="scss">
.section {
  padding: 3rem 0.15rem;
}

.box-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.file-cta {
  background-color: #faf8ff;
  border: 0;
  border-radius: 4px !important;
  transition: 200ms;

  .file-icon {
    opacity: 0.2;
    margin-bottom: 0.5em;
  }
}

.file-label,
.file-name {
  font-weight: 400;
  font-size: 0.925em;
  color: #7e7e9c !important;

  &:hover .file-cta {
    background-color: #f0eef5;
  }
}

.file-name {
  border: 0;
}

.picture-filename {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 13px;
  color: #c2c2c2;
}
</style>
