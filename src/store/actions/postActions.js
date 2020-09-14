import * as fb from "@/firebase";
import store from "..";

// realtime firebase
fb.postsCollection.orderBy("createdOn", "desc").onSnapshot((snapshot) => {
  let postsArray = [];

  snapshot.forEach((doc) => {
    let post = doc.data();
    post.id = doc.id;

    postsArray.push(post);
  });
  store.commit("setPosts", postsArray);
});

export default {
  async createPost({ state, commit }, post) {
    await fb.postsCollection.add({
      createdOn: new Date(),
      content: post.content,
      userId: fb.auth.currentUser.uid,
      userName: state.userProfile.name,
      comments: 0,
      likes: 0,
    });
  },
};
