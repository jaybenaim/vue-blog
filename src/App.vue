<template>
  <div id="app">
    <SiteNav v-if="showNav"></SiteNav>
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";
import SiteNav from "@/components/SiteNav";

export default {
  components: { SiteNav },
  computed: {
    // destructuring userProfile
    ...mapState(["userProfile"]),
    showNav() {
      return Object.keys(this.userProfile).length > 1;
    },
  },
};
</script>