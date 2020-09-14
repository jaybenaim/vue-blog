<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button
                class="button"
                @click="createPost()"
                :disabled="post.content === ''"
              >
                post
              </button>
            </form>
          </div>
        </div>
      </div>
      <transition name="fade">
        <CommentModal
          v-if="showCommentModal"
          :post="selectedPost"
          @close="toggleCommentModal()"
        ></CommentModal>
      </transition>
      <div class="col2">
        <transition name="fade">
          <p v-if="showAlert" :class="alertMessage ? 'success' : 'danger'">
            {{ alertMessage }}
          </p>
        </transition>
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
            <h5>{{ post.userName }}</h5>
            <span>{{ post.createdOn | formatDate }}</span>
            <div v-if="beingEdited && post.id === selectedPost.id">
              <textarea v-model.trim="editedPost.content"></textarea>
            </div>
            <p v-else>{{ post.content | trimLength }}</p>
            <ul>
              <li>
                <a @click="toggleCommentModal(post)"
                  >comments {{ post.comments }}</a
                >
              </li>

              <li>
                <a @click="likePost(post.id, post.likes)">
                  likes {{ post.likes }}</a
                >
              </li>
              <li>
                <a @click="viewPost(post)">view full post </a>
              </li>
              <li v-if="post.userId === userId">
                <button
                  v-if="beingEdited && post.id === selectedPost.id"
                  @click="updatePost(post)"
                  :disabled="editedPost.content === ''"
                  class="uk-button-primary"
                >
                  save
                </button>
                <a @click="editPost(post)" v-else>edit</a>
              </li>
              <li v-if="post.userId === userId">
                <a @click="deletePost(post)" style="color:red;">delete</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- Full Post Modal -->
    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <h5>{{ fullPost.userName }}</h5>
            <span>{{ fullPost.createdOn | formatDate }}</span>
            <p>{{ fullPost.content }}</p>
            <ul>
              <li>
                <a>comments {{ fullPost.comments }}</a>
              </li>
              <li>
                <a>likes {{ fullPost.likes }}</a>
              </li>
            </ul>
          </div>
          <div v-show="postComments.length" class="comments">
            <div
              v-for="comment in postComments"
              :key="comment.id"
              class="comment"
            >
              <p>{{ comment.userName }}</p>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import CommentModal from "@/components/CommentModal";
import { commentsCollection, postsCollection, auth } from "@/firebase";

export default {
  data() {
    return {
      post: {
        content: "",
      },
      editedPost: {
        content: "",
      },
      showCommentModal: false,
      selectedPost: {},
      showPostModal: false,
      fullPost: {},
      postComments: [],
      beingEdited: false,
      showAlert: false,
      alertMessage: "",
    };
  },
  components: { CommentModal },
  computed: {
    ...mapState(["userProfile", "posts"]),
    userId() {
      return auth.currentUser.uid;
    },
  },
  methods: {
    createPost() {
      this.$store.dispatch("createPost", { content: this.post.content });
      this.post.content = "";
    },
    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal;

      if (this.showCommentModal) {
        this.selectedPost = post;
      } else {
        this.selectedPost = {};
      }
    },
    likePost(id, likesCount) {
      this.$store.dispatch("likePost", { id, likesCount });
    },
    async viewPost(post) {
      const docs = await commentsCollection
        .where("postId", "==", post.id)
        .get();

      docs.forEach((doc) => {
        let comment = doc.data();
        comment.id = doc.id;
        this.postComments.push(comment);
      });
      this.fullPost = post;
      this.showPostModal = true;
    },
    editPost(post) {
      this.selectedPost = post;
      this.beingEdited = true;
    },
    async updatePost(post) {
      await postsCollection.doc(post.id).update({
        content: this.editedPost.content,
      });
      this.beingEdited = false;
      this.selectedPost = {};
    },
    async deletePost(post) {
      await postsCollection
        .doc(post.id)
        .delete()
        .then((res) => (this.alertMessage = "Post deleted"))
        .catch((err) => (this.alertMessage = "Error deleting Post"));

      this.showAlert = !this.showAlert;
      setTimeout(() => {
        this.showAlert = !this.showAlert;
      }, 2000);
    },
    closePostModal() {
      this.postComments = [];
      this.showPostModal = false;
    },
  },
  filters: {
    formatDate(val) {
      if (!val) return "-";
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      return val.length < 200 ? val : `${val.substring(0, 200)}...`;
    },
  },
};
</script>
