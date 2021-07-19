<template>
  <layout name="LayoutApp">
    <div class="profile">
      <profile-developer v-if="userDetails.is_developer" />
      <profile-default v-else />
    </div>
  </layout>
</template>
<script>
import Layout from "../../../layouts";
import ProfileDefault from "./ProfileDefault";
import ProfileDeveloper from "./ProfileDeveloper";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: {
    Layout,
    ProfileDefault,
    ProfileDeveloper,
  },
  computed: {
    ...mapGetters({
      userDetails: "myUser",
    }),
  },
  mounted() {},
};
</script>
<style scoped></style>
