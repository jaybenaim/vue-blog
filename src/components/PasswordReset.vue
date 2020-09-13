<template>
  <div class="modal">
    <div class="modal-content">
      <div @click="$emit('close')" class="close">close</div>
      <h3>Reset Password</h3>
      <div v-if="!showSuccess">
        <p>Enter your email to reset your password</p>
        <form @submit.prevent>
          <input
            v-model.trim="email"
            type="email"
            :placeholder="!userEmail ? 'you@email.com' : userEmail"
          />
        </form>
        <p v-if="errorMsg !== ''" class="error">{{errorMsg}}</p>

        <button @click="resetPassword()" class="button">Reset</button>
      </div>
      <p v-else>Success! Check your email for a reset link.</p>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase";

export default {
  data() {
    return {
      email: "",
      showSuccess: false,
      errorMsg: "",
    };
  },
  props: ["userEmail"],

  methods: {
    async resetPassword() {
      this.errorMsg = "";

      await auth
        .sendPasswordResetEmail(this.email)
        .then((res) => {
          this.showSuccess = true;
        })
        .catch((err) => {
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

