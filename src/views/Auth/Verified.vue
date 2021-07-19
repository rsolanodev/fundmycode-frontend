<template>
  <layout name="LayoutDefault">
    <div class="verified">
      <p v-if="validate">Se ha podido validar</p>
      <p v-else>No se ha podido validar</p>
    </div>
  </layout>
</template>
<script>
import Layout from "../../layouts";
import { RepositoryFactory } from "../../api/RepositoryFactory";

const VerifyRepository = RepositoryFactory.get("verify");

export default {
  name: "Verified",
  components: {
    Layout,
  },
  data() {
    return {
      validate: false,
    };
  },
  computed: {},
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let formData = new FormData();
      formData.append("verification_code", this.$route.params.token);
      VerifyRepository.validate(formData).then(
        () => {
          this.validate = true;
        },
        () => {
          this.validate = false;
        }
      );
    },
  },
};
</script>
<style scoped lang="scss"></style>
