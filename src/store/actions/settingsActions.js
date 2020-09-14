import * as fb from "@/firebase";

export default {
  async updateProfile({ dispatch }, user) {
    const userId = fb.auth.currentUser.uid;
    // update user object
    const userRef = await fb.usersCollection.doc(userId).update({
      name: user.name,
      title: user.title,
    });

    dispatch("fetchUserProfile", { uid: userId });

    // update all posts by user
    const postDocs = await fb.postsCollection
      .where("userId", "==", userId)
      .get();
    postDocs.forEach((doc) => {
      fb.postsCollection.doc(doc.id).update({
        userName: user.name,
      });
    });

    // update all comments by user
    const commentDocs = await fb.commentsCollection
      .where("userId", "==", userId)
      .get();
    commentDocs.forEach((doc) => {
      fb.commentsCollection.doc(doc.id).update({
        userName: user.name,
      });
    });
  },
};
