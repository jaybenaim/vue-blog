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
  async likePost({ commit }, post) {
    const userId = fb.auth.currentUser.uid;
    const docId = `${userId}_${post.id}`;

    // check if user has a liked post
    const doc = await fb.likesCollection.doc(docId).get();
    if (doc.exists) return;

    // create post
    await fb.likesCollection.doc(docId).set({
      postId: post.id,
      userId,
    });
    // update post likes count
    fb.postsCollection.doc(post.id).update({
      likes: post.likesCount + 1,
    });
  },
};
